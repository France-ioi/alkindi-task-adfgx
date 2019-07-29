const fs = require("fs");
const path = require("path");
const doAsync = require("doasync");
const asyncFs = doAsync(fs);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVXYZ';
const INITIAL_SCORE = 1000;

module.exports.config = {
  cache_task_data: false
};

module.exports.taskData = function (args, callback) {
  generateTaskData(args.task)
    .then(function ({privateData, publicData}) {
      // TODO: cache privateData
      callback(null, publicData);
    })
    .catch(function (error) {
      console.error(error);
      callback(error);
    });
};

async function generateTaskData (task) {
  const baseDir = path.join(__dirname, "task_data");
  const cipher_text = await asyncFs.readFile(
    path.join(baseDir, "task.txt"),
    "utf8"
  ).then(txt => txt.trim());
  const hints = await asyncFs.readFile(
    path.join(baseDir, "hints.txt"),
    "utf8"
  ).then(txt => txt.trim());
  const plain_text = await asyncFs.readFile(
    path.join(baseDir, "plain.txt"),
    "utf8"
  ).then(txt => txt.trim());
  const answer = await asyncFs.readFile(
    path.join(baseDir, "answer.txt"),
    "utf8"
  ).then(txt => txt.trim());

  const hint_lines = hints.trim().split('\n');
  const permutation = read_permutation(hint_lines[0]);
  const substitution_grid = read_grid(hint_lines.slice(hint_lines.length - 5));

  const initial_permutation = empty_permutation(permutation);
  const initial_grid = empty_grid(substitution_grid);
  let score = INITIAL_SCORE;

  const privateData = {
    cipher_text,
    hints,
    plain_text,
    answer,
    permutation,
    substitution_grid,
  };
  const hints_requested = getHintsRequested(task.hints_requested);

  for (let hint of hints_requested) {
    score -= get_hint_cost(hint.type);
    switch (hint.type) {
      case 'subst-decipher':
      case 'subst-cipher': {
        const {row, col, rank} = hint;
        initial_grid[row][col] = rank;
        break;
      }
      case 'perm-decipher':
      case 'perm-cipher': {
        const {fromLine, toLine} = hint;
        initial_permutation[fromLine] = toLine;
        break;
      }
      default:
        break;
    }
  }

  score = Math.max(0, score);

  const publicData = {
    cipher_text,
    permutation: initial_permutation,
    substitution_grid: initial_grid,
    score
  };
  return {privateData, publicData};
}

function getHintsRequested (hints_requested) {
  return (hints_requested ? JSON.parse(hints_requested) : []).filter(
    hr => hr !== null
  );
}

function get_hint_cost (query) {
  switch (query) {
    case 'subst-decipher':
      return 35;
    case 'subst-cipher':
      return 50;
    case 'perm-decipher':
      return 200;
    case 'perm-cipher':
      return 200;
    default:
      return (INITIAL_SCORE + 1);
  }
}


function read_permutation (text) {
  const chars = text.split('');
  return chars.map((char, i) => [i, char])
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(i => i[0]);
}

function empty_permutation (permutation) {
  return Array(permutation.length).fill(null);
}

function read_grid (lines) {
  return lines.slice(Math.max(lines.length - 5, 0)).map((line) =>
    line.trim().split(' ').map(cell =>
      alphabet.indexOf(cell)
    )
  );
}

function empty_grid (grid) {
  return grid.map(row => row.map(cell => null));
}

function find_in_grid (grid, value) {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] == value) {
        return [row, col];
      }
    }
  }
  return [-1, -1];
}

function get_subst_decipher_hint (task, row, col) {
  const src_hints = task['substitution_grid'];
  const rank = src_hints[row][col];
  return {row, col, rank};
}

function get_subst_cipher_hint (task, rank) {
  const src_hints = task['substitution_grid'];
  const [row, col] = find_in_grid(src_hints, rank);
  return {row, col, rank};
}

function get_perm_decipher_hint (task, fromLine) {
  const src_hints = task['permutation'];
  const toLine = src_hints[fromLine];
  return {fromLine, toLine};
}

function get_perm_cipher_hint (task, fromLine) {
  const src_hints = task['permutation'];
  const index = src_hints.indexOf(fromLine);
  const toLine = src_hints[index];
  return {fromLine: index, toLine};
}

module.exports.requestHint = function (args, callback) {
  generateTaskData(args.task).then(function ({privateData, publicData}) {

    const getHint = () => {
      switch (args.request.type) {
        case 'subst-decipher': {
          const {row, col} = args.request;
          return get_subst_decipher_hint(privateData, parseInt(row), parseInt(col));
        }
        case 'subst-cipher': {
          const rank = parseInt(args.request.rank);
          return get_subst_cipher_hint(privateData, rank);
        }
        case 'perm-decipher': {
          const line = parseInt(args.request.line);
          return get_perm_decipher_hint(privateData, line);
        }
        case 'perm-cipher': {
          const line = parseInt(args.request.line);
          return get_perm_cipher_hint(privateData, line);
        }
        default:
          return null;
      }
    };

    const hintData = getHint();
    console.log('hintData', hintData);
    if (hintData) {
      return callback(null, {
        ...args.request,
        ...hintData,
      });
    }
    return callback(new Error("invalid hint type"));
  });
};

module.exports.gradeAnswer = function (args, task_data, callback) {
  // args.random_seed // 2
  // JSON.parse(args.hints_requested) // [{}]
  // JSON.parse(args.answer.value).gridEdits // [[{letter: 'A'}]]
  // args.min_score // 0
  // args.max_score // 40
  // args.no_score // 0
  // task_data.alphabet // 'ABCDEFGHIJKLMNOPQRSTUVXYZ',
  // task_data.cipherText // 'QS EIKF EIKFISQVI CIRH…'

  const hintsRequested = getHintsRequested(args.answer.hints_requested);
  const nHints = hintsRequested.length;

  const {clearText} = JSON.parse(args.answer.value);

  generateTaskData(args.task)
    .then(function ({privateData, publicData}) {
      let score = publicData.score,
        message = ` Vous avez utilisé ${nHints} indice${
          nHints > 1 ? "s" : ""
          }.`;

      const plain_text = privateData.plain_text;
      let same = clearText == plain_text;

      if (same) {
        message =
          "Bravo, vous avez retrouvé la clé de déchiffrement." + message;
      } else {
        score = 0;
        message = "La clé de déchiffrement est incorrecte." + message;
      }

      callback(null, {
        score,
        message
      });
    })
    .catch(function (error) {
      console.error(error);
      callback(error);
    });
};

/*
!function () {
    module.exports.gradeAnswer({
        task: {random_seed: 300348454218987061, params: {version: '2'}, hints_requested: "[]"},
        answer: {value: '{"rotors":[[2,7,13,18,1,25,15,24,16,0,10,3,12,20,23,4,9,5,17,21,22,6,11,14,19,8],[16,23,2,20,4,8,11,10,6,5,-1,14,19,12,13,18,17,7,9,21,15,22,-1,25,3,24]]}'}
    }, {}, function (err, result) {
        if (err) { console.log(err); return; }
        console.log(JSON.stringify(result, null, 2));
    });
}();
*/

/*
import os
import random
import re
from unidecode import unidecode
from difflib import SequenceMatcher
from decimal import Decimal

INITIAL_SCORE = 500


def get_task(index):


def task_file(dir, name):
    full_path = os.path.join(dir, name)
    if not os.path.isfile(full_path):
        raise RuntimeError("missing file: {}".format(full_path))
    return full_path




def get_hint(task, query):
    try:
        if query['type'] == 'grid':
            return get_grid_hint(task, int(query['row']), int(query['col']))
        if query['type'] == 'alphabet':
            return get_alphabet_hint(task, int(query['rank']))
        return False
    except KeyError:
        return False


def get_grid_hint(task, row, col):
    if task['score'] < 10:
        return False
    try:
        dst_hints = task['team_data']['hints']
        if 'l' in dst_hints[row][col]:
            return False
        src_hints = task['full_data']['hints']
        cell = src_hints[row][col]
        dst_hints[row][col] = cell
        task['score'] -= 10
        return True
    except IndexError:
        return False


def get_alphabet_hint(task, rank):
    if task['score'] < 10:
        return False
    src_hints = task['full_data']['hints']
    dst_hints = task['team_data']['hints']
    for row, row_cells in enumerate(src_hints):
        for col, cell in enumerate(row_cells):
            if cell['l'] == rank and 'l' not in dst_hints[row][col]:
                task['score'] -= 10
                dst_hints[row][col] = cell
                return True
    return False


def print_hints(hints):
    for row_cells in hints:
        for cell in row_cells:
            if 'l' in cell:
                print(ALPHABET[cell['l']], end=' ')
            else:
                print(' ', end=' ')
        print('')


def reset_hints(task):
    task['score'] = INITIAL_SCORE
    task['team_data']['hints'] = task['full_data']['initial_hints']


def fix_hints(hints):
    for row_cells in hints:
        for cell in row_cells:
            q = cell['q'])
            if q == 'hint':
                return False
            if q == 'confirmed':
                cell['q'] = 'hint'
    return True


def fix_task(task):
    # Use a binary or to always check all three grids.
    return (fix_hints(task['full_data']['hints']) |
            fix_hints(task['full_data']['initial_hints']) |
            fix_hints(task['team_data']['hints']))


def canon_number(input):
    return re.sub('[^0-9]*', '', input)


def canon_address(input):
    # Map to ASCII, strip, uppercase.
    input = unidecode(input).strip().upper()
    # Remove all non-alphanum characters.
    input = re.sub('[^0-9A-Z]*', '', input)
    input = re.sub('W', 'V', input)
    input = re.sub('X', '', input)
    return input


def grade(task, data):

    base_score = task['score']

    # Scores above score_threshold are considered solutions.
    score_threshold = Decimal('10')

    in_n1 = canon_number(data['n1'], ''))
    in_n2 = canon_number(data['n2'], ''))
    in_ad = canon_address(data['a'], ''))

    if len(in_ad) > 100 or len(in_n1) > 2 or len(in_n2) > 3:
        return None
    if len(in_ad) == 0 and len(in_n1) == 0 and len(in_n2) == 0:
        return None

    (ex_n1, ex_n2, ex_ad) = task['full_data']['answer_txt'].split('\n')
    ex_n1 = canon_number(ex_n1)
    ex_n2 = canon_number(ex_n2)
    ex_ad = canon_address(ex_ad)

    numbers_equal = Decimal(int(ex_n1 == in_n1 and ex_n2 == in_n2))
    address_ratio = Decimal(str(SequenceMatcher(None, ex_ad, in_ad).ratio()))
    address_errors = round((Decimal(len(ex_ad)) - address_ratio * Decimal(len(ex_ad))) * Decimal(2))

    score_factor = (numbers_equal * Decimal('0.5') +
                    Decimal(int(in_ad == ex_ad)) * Decimal('0.5'))
    score = Decimal(base_score) * score_factor
    is_solution = score > score_threshold
    is_full_solution = score_factor == Decimal('1')

    return {
        'input': {'n1': in_n1, 'n2': in_n2, 'ad': in_ad},
        'expected': {'n1': ex_n1, 'n2': ex_n2, 'ad': ex_ad},
        'hints': task['team_data']['hints'],
        'base_score': str(base_score),
        'actual_score': str(score),
        'is_solution': score >= score_threshold,
        'is_full_solution': is_full_solution,
        'numbers_equal': str(numbers_equal),
        'address_ratio': str(address_ratio),
        'address_errors': str(address_errors),
        'feedback': {
            'address': address_errors == Decimal(0),
            'numbers': numbers_equal == Decimal(1)
        }
    }


def test_grader():
    print(grade(
        {'full_data': {'answer.txt': "14\n449\n134 avenue de Wagram"},
         'team_data': {'score': 490}},
        {"n1": '14', "n2": '449', 'a': "134 avenue de Vagram"}))


if __name__ == '__main__':
    task = get_task('/home/sebc/alkindi/tasks/playfair/INDEX')
    print('fixed? {}'.format(fix_task(task)))
    print('fixed again? {}'.format(fix_task(task)))
    print_hints(task['team_data']['hints'])
    print("Initial score={}\n".format(task['score']))

    print("Getting a grid hint:")
    get_hint(task, {'type': 'grid', 'row': 0, 'col': 0})
    print_hints(task['team_data']['hints'])
    print("New score={}\n".format(task['score']))

    print("Getting an alphabet hint:")
    get_hint(task, {'type': 'alphabet', 'rank': 4})
    print_hints(task['team_data']['hints'])
    print("New score={}\n".format(task['score']))
*/
