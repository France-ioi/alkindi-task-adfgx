import React from 'react';
import range from 'node-range';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import classnames from 'classnames';
import {OkCancel, Python, Tooltip} from '../ui';
import {call, put, select, takeEvery} from 'redux-saga/effects';

import {getInversePermutation} from '../utils';

/*

Persistent state:

   outputSubstitutionVariable
   outputPermutationVariable

Transient state:

   selectedLetterRank
   selectedRow
   selectedCol
   selectedCipherPos
   selectedDecipherPos
   selectedLetterRank
   hintQuery: {type, letter, rank}
   hintObtained
   hintsGrid
   getHint
   getQueryCost
   outputSubstitution
   outputPermutation

*/

const Grid = function (props) {

  const onClick = function (event) {
    const element = event.currentTarget;
    const row = parseInt(element.getAttribute('data-row'));
    const col = parseInt(element.getAttribute('data-col'));
    const bigram = element.getAttribute('data-bigram');
    let rank = parseInt(element.getAttribute('data-rank'));
    if (isNaN(rank))
      rank = null;
    props.onClick(row, col, bigram, rank);
  };

  //render
  const {grid, bigramAlphabet, clearAlphabet} = props;
  const {selectedRow, selectedCol} = props;
  const nbRows = grid.length;
  const nbCols = grid[0].length;
  const renderCell = function (row, col) {
    const rank = grid[row][col];
    const symbol = rank === null ? ' ' : clearAlphabet.symbols[rank];
    const bigram = bigramAlphabet.symbols[row * nbCols + col];
    const classes = [
      'adfgx-cell',
      (selectedRow === row && selectedCol === col) && 'adfgx-cell-selected',
      rank !== null && 'adfgx-hint-obtained'
    ];
    return <td key={col} className={classnames(classes)} onClick={onClick} data-row={row} data-col={col} data-rank={rank} data-bigram={bigram}>{symbol}</td>;
  };
  const renderRow = function (row) {
    return (
      <tr key={row}>
        <th>{bigramAlphabet.symbols[row * nbCols].charAt(0)}</th>
        {range(0, nbCols).map(col => renderCell(row, col))}
      </tr>
    );
  };
  return (
    <table className='adfgx-grid'>
      <thead>
        <tr><th />{range(0, nbRows).map(i => <th key={i}>{bigramAlphabet.symbols[i].charAt(1)}</th>)}</tr>
      </thead>
      <tbody>
        {range(0, nbRows).map(renderRow)}
      </tbody>
    </table>
  );
  //render
};


const Alphabet = function (props) {

  const onClick = function (event) {
    const element = event.currentTarget;
    const rank = parseInt(element.getAttribute('data-rank'));
    const letter = element.getAttribute('data-letter');
    const bigram = element.getAttribute('data-bigram');
    props.onClick(rank, letter, bigram);
  };


  const {grid, bigramAlphabet, clearAlphabet, selectedLetterRank} = props;
  const letterRankBigram = Array(bigramAlphabet.size).fill(null);
  const nCols = grid[0].length;

  grid.forEach(function (row, iRow) {
    row.forEach(function (rank, iCol) {
      if (rank !== null)
        letterRankBigram[rank] = bigramAlphabet.symbols[iRow * nCols + iCol];
    });
  });

  const renderCell = function (i) {
    if (i === 22) {
      return <td key={i} className='qualifier-disabled'></td>;
    }
    // no W
    const letterRank = i > 22 ? i - 1 : i;
    const letter = clearAlphabet.symbols[letterRank];
    const bigram = letterRankBigram[letterRank];
    const classes = [
      'adfgx-cell',
      selectedLetterRank === letterRank && 'adfgx-cell-selected',
      bigram !== null && 'adfgx-hint-obtained'
    ];
    return (
      <td key={i} className={classnames(classes)} onClick={onClick} data-rank={letterRank} data-letter={letter} data-bigram={bigram}>
        <span className='adfgx-target'>{letter}</span>
        <span className='adfgx-source'>{bigram}</span>
      </td>
    );
  };

  const renderRow = function (row) {
    return <tr key={row}>{range(0, 13).map(col => renderCell(row * 13 + col))}</tr>;
  };

  return (
    <table className='adfgx-alphabet'>
      <tbody>
        {renderRow(0)}{renderRow(1)}
      </tbody>
    </table>
  );
};


const Permutation = function (props) {

  const onClick = function (event) {
    const element = event.currentTarget;
    const fromLine = parseInt(element.getAttribute('data-from'));
    let toLine = parseInt(element.getAttribute('data-to'));
    if (isNaN(toLine))
      toLine = null;
    props.onClick(fromLine, toLine);
  };

  const {permutation, selectedPos, show} = props;

  const renderCell = function (cell, iCell) {
    const classes = [
      'adfgx-cell',
      selectedPos === iCell && 'adfgx-cell-selected',
      cell.q === 'hint' && 'adfgx-hint-obtained'
    ];
    const symbol = show === 'source' ? iCell + 1 :
      (cell.l === undefined ? ' ' : cell.l + 1);
    return (
      <td key={iCell} className={classnames(classes)} onClick={onClick} data-from={iCell} data-to={cell.l}>
        {symbol}
      </td>
    );
  };

  return (
    <table className='adfgx-alphabet'>
      <tbody>
        <tr>{permutation.map(renderCell)}</tr>
      </tbody>
    </table>
  );
};


const HintQuery = function (props) {
  const {hintRequest, query, cost, score, obtained, onOk, onCancel} = props;

  if (!hintRequest && query) {
    return (
      <div className='dialog'>
        <p>
          <strong>Indice demandé :</strong>{' '}
          {query.type === "subst-cipher" &&
            <span>bigramme chiffrant la lettre <strong>{query.letter}</strong></span>}
          {query.type === "subst-decipher" &&
            <span>lettre déchiffrant le bigramme <strong>{query.bigram}</strong></span>}
          {query.type === "perm-decipher" &&
            <span>ligne où est envoyée la ligne <strong>{query.line + 1}</strong> lors du déchiffrage</span>}
          {query.type === "perm-cipher" &&
            <span>ligne où est envoyée la ligne <strong>{query.line + 1}</strong> lors du chiffrage</span>}
        </p>
        {!obtained && <p><strong>Coût :</strong> {cost} points</p>}
        {!obtained && <p><strong>Score disponible :</strong> {score} points</p>}
        {!obtained && <p>L’indice obtenu sera visible par toute l’équipe.</p>}
        {obtained && <p>L’indice a déjà été obtenu.</p>}
        {obtained
          ? <OkCancel onOk={onCancel} />
          : <OkCancel onOk={onOk} onCancel={onCancel} />
        }
      </div>
    );
  } else if (hintRequest && hintRequest.code <= 50) {
    return <div className='dialog'>En attente de réponse du serveur</div>;
  } else if (hintRequest && hintRequest.success === true) {
    return (
      <div className='dialog'>
        <p>Indice obtenu.</p>
        <OkCancel onOk={onCancel} />
      </div>
    );
  } else if (hintRequest && hintRequest.success === false) {
    return (
      <div className='dialog'>
        <p>Une erreur s'est produite et l'indice n'a pas été obtenu.</p>
        <OkCancel onOk={onCancel} />
      </div>
    );
  } else if (hintRequest && hintRequest.error) {
    return (
      <div className="dialog">
        <p>{hintRequest.error}</p>
        <OkCancel onOk={onCancel} />
      </div>
    );
  }

  return false;
};


const PermWiring = function (props) {

  // distributes heights from 1 to premutation.length included
  const getPlateauHeights = function (permutation) {
    let height = 1;
    const srcHeights = [];
    // connexions going to the left get the first ones, in increasing order so they don't intersect eachother
    for (let src = 0; src < permutation.length; src++) {
      const dst = permutation[src];
      if (dst !== undefined && dst < src) {
        srcHeights[src] = height;
        height++;
      }
    }
    // then straight connexions
    for (let src = 0; src < permutation.length; src++) {
      const dst = permutation[src];
      if (dst !== undefined && dst == src) {
        srcHeights[src] = height;
        height++;
      }
    }
    // then connexions going to the right, in reverse order so they don't intersect eachother
    for (let src = permutation.length - 1; src >= 0; src--) {
      const dst = permutation[src];
      if (dst !== undefined && src < dst) {
        srcHeights[src] = height;
        height++;
      }
    }
    return srcHeights;
  };

  // we build a permutation.length x permutation.length*2 grid, containing
  // the descriptions of connectors for the given permutation
  // connectors start in even cells at the top, and odd cells at the bottom
  const getPermutationDisplayGrid = function (permutation) {
    const grid = [];
    for (let row = 0; row < permutation.length + 2; row++) {
      grid[row] = [];
      for (let col = 0; col < permutation.length; col++) {
        grid[row][col * 2] = 0;
        grid[row][col * 2 + 1] = 0;
      }
    }
    // for each top (source) connector, we get the height of the plateau
    const srcHeights = getPlateauHeights(permutation);
    // we add each connexion one by one
    for (let src = 0; src < permutation.length; src++) {
      const dst = permutation[src];
      if (dst === undefined)
        continue;
      //const side = dst <= src ? 1 : 0;
      const height = srcHeights[src];
      // top vertical line
      for (let row = 0; row < height; row++) {
        grid[row][src * 2] += 5; // |
      }
      // bottom vertical line
      for (let row = height + 1; row < permutation.length + 2; row++) {
        grid[row][dst * 2 + 1] += 5; // |
      }
      if (src <= dst) { // top is on the left side of bottom connector)
        // horizontal line (too long but will be overwritten)
        for (let col = src; col <= dst; col++) {
          grid[height][col * 2] += 10; // -
          grid[height][col * 2 + 1] += 10; // -
        }
        // elbows (overwrites part of the horizontal line)
        grid[height][src * 2] = 3; // └
        grid[height][dst * 2 + 1] = 12; // ┐
      } else if (src > dst) {
        // right elbow
        grid[height][src * 2] = 9; // ┘
        // horizontal line
        for (let col = dst + 1; col < src; col++) {
          grid[height][col * 2] += 10; // -
          grid[height][col * 2 + 1] += 10; // -
        }
        // left elbow
        grid[height][dst * 2 + 1] = 6; // ┌
      }
    }
    return grid;
  };

  const renderTile = function (key, bits) {
    const tile = 'a..b.cd..ef.g..h'.charAt(bits);
    return <div key={key} className={"adfgx-wire-cell adfgx-wire-cell-" + tile} />;
  };

  const {permutation} = props;
  const grid = getPermutationDisplayGrid(permutation.map(c => c.l));
  return (
    <div className="adfgx-perm-wiring">
      {grid.map((row, iRow) =>
        <div key={iRow} className="adfgx-wire-line">
          {row.map((cell, iCol) => renderTile(iCol, cell))}
        </div>)}
    </div>
  );
};


class Hints extends React.PureComponent {

  onSelectInGrid = (row, col, bigram, rank) => {
    this.props.dispatch({type: this.props.selectInGrid, row, col, bigram, rank});
  }

  onSelectInAlphabet = (letterRank, letter, bigram) => {
    this.props.dispatch({type: this.props.selectInAlphabet, letterRank, letter, bigram});
  }

  onSelectInDecipherPerm = (fromLine, toLine) => {
    this.props.dispatch({type: this.props.selectInDecipherPerm, fromLine, toLine});
  }

  onSelectInCipherPerm = (fromLine, toLine) => {
    this.props.dispatch({type: this.props.selectInCipherPerm, fromLine, toLine});
  }

  onQueryHint = () => {
    this.props.dispatch({type: this.props.requestHint, payload: {request: this.props.hintQuery}});
    // this.props.dispatch({type: this.props.resetHintQuery});
  }

  onCancelHintQuery = () => {
    this.props.dispatch({type: this.props.resetHintQuery});
  }

  getQueryCost (query) {
    if (query.type === 'subst-decipher') {
      return 35;
    } else if (query.type === 'subst-cipher') {
      return 50;
    } else if (query.type === 'perm-decipher') {
      return 200;
    } else if (query.type === 'perm-cipher') {
      return 200;
    } else {
      return 1000;
    }
  }

  renderInstructionPython = () => {
    const {outputSubstitutionVariable, substitutionGridHints, clearAlphabet} = this.props;

    const renderCell = function (l) {
      return l === null ? 'None' : ('\'' + clearAlphabet.symbols[l] + '\'');
    };

    return (
      <Python.Assign>
        <Python.Var name={outputSubstitutionVariable} />
        <Python.Grid grid={substitutionGridHints} renderCell={renderCell} />
      </Python.Assign>
    );
  }

  render () {
    const {
      selectedRow, selectedCol, selectedLetterRank, selectedDecipherPos, selectedCipherPos, hintQuery, hintObtained, outputPermutation, inversePermutation, score, substitutionGridHints, bigramAlphabet, clearAlphabet, hintRequest
    } = this.props;
    const areHintsEnabled = true;
    return (
      <div className='panel panel-default task-hints'>
        <div className='panel-heading'>
          <span className='code'>
            {this.renderInstructionPython()}
          </span>
        </div>
        <div className='panel-body'>
          {hintQuery && <HintQuery hintRequest={hintRequest} query={hintQuery} cost={this.getQueryCost(hintQuery)} obtained={hintObtained} score={score} onOk={this.onQueryHint} onCancel={this.onCancelHintQuery} />}
          {areHintsEnabled && <div className='grillesSection'>
            <p className='hints-title'>Plusieurs types d'indices sont disponibles :</p>
            <p className='hints-section-title'>Des indices sur le contenu de la grille :</p>
            <div className='adfgx-hints-grid'>
              <p>
                {'Révéler une case : '}
                {this.getQueryCost({type: "subst-decipher"})}
                {' points '}
                <Tooltip content={<p>Cliquez sur une case de la grille pour demander quelle lettre elle contient.</p>} />
              </p>
              <Grid grid={substitutionGridHints} bigramAlphabet={bigramAlphabet} clearAlphabet={clearAlphabet} onClick={this.onSelectInGrid} selectedRow={selectedRow} selectedCol={selectedCol} />
            </div>
            <div className='adfgx-hints-alphabet'>
              <p>
                {'Révéler la position d\'une lettre : '}
                {this.getQueryCost({type: "subst-cipher"})}
                {' points '}
                <Tooltip content={<p>Cliquer sur une lettre non grisée ci-dessous pour demander sa position au sein de la grille.</p>} />
              </p>
              <Alphabet grid={substitutionGridHints} bigramAlphabet={bigramAlphabet} clearAlphabet={clearAlphabet} onClick={this.onSelectInAlphabet} selectedLetterRank={selectedLetterRank} />
            </div>
            <p className='hints-section-title'>Des indices sur la permutation :</p>
            <div className='adfgx-hints-perm-labels'>
              <p>
                {'Révéler la ligne où sera envoyée chacune des 6 lignes pour obtenir le message intermédiaire : '}
                {this.getQueryCost({type: "perm-decipher"})}
                {' points '}
                <Tooltip content={<p>Cliquez sur une case de la ligne du haut pour voir vers quelle position elle est envoyée lors de l'application de la permutation de déchiffrement.</p>} />
              </p>
              <p>
                {'Révéler la ligne d\'origine d\'une des 6 lignes du message intermédiaire : '}
                {this.getQueryCost({type: "perm-cipher"})}
                {' points '}
                <Tooltip content={<p>Cliquez sur une case de la ligne du bas pour voir quelle position de la ligne du haut est envoyée vers cette position lors de la permutation de déchiffrement.</p>} />
              </p>
            </div>
            <div className='adfgx-hints-perm-grid'>
              <div className='adfgx-hints-perm-decipher'>
                <Permutation permutation={outputPermutation} show='target' selectedPos={selectedDecipherPos} onClick={this.onSelectInDecipherPerm} />
              </div>
              <div>
                <PermWiring permutation={outputPermutation} />
              </div>
              <div className='adfgx-hints-perm-cipher'>
                <Permutation permutation={inversePermutation} show='source' selectedPos={selectedCipherPos} onClick={this.onSelectInCipherPerm} />
              </div>
            </div>
          </div>}
          <div className='task-score'>
            <span>
              <strong>{'Points disponibles :'}</strong>
              {' ' + score + ' points '}
              <Tooltip content={<p>Score que votre équipe obtiendra si vous résolvez le sujet sans demander d’autres indices. Il diminue à chaque fois qu’un membre de l’équipe demande un indice.</p>} />
            </span>
          </div>
          {!areHintsEnabled && <div>
            <p>Pour la première journée du 3ème tour, les indices sont désactivés.</p>
            <p>
              Nous vous invitons à essayer de déchiffrer le message sans aucun
              indice.
              C'est possible avec un peu de persévérance et une bonne stratégie.
                  </p>
            <p>À partir de demain, vous pourrez demander des indices.</p>
          </div>}
        </div>
      </div>
    );
  }

}

const noSelection = {
  selectedLetterRank: undefined,
  selectedRow: undefined,
  selectedCol: undefined,
  selectedCipherPos: undefined,
  selectedDecipherPos: undefined
};


function HintsSelector (state) {
  const {
    hintRequest, hints,
    actions: {
      requestHint,
      resetHintQuery,
      selectInGrid,
      selectInAlphabet,
      selectInDecipherPerm,
      selectInCipherPerm
    },
    taskData: {score},
    bigramAlphabet,
    clearAlphabet,
    substitutionGridHints
  } = state;

  return {
    hintRequest,
    requestHint,
    resetHintQuery,
    selectInGrid,
    selectInAlphabet,
    selectInDecipherPerm,
    selectInCipherPerm,
    score, bigramAlphabet, clearAlphabet, substitutionGridHints, ...hints
  };
}

function taskInitReducer (state, _action) {
  const updateObj = {
    ...noSelection, hintQuery: undefined, hintObtained: false,
    outputSubstitutionVariable: "substitutionIndices",
    outputPermutationVariable: "permutationIndices"
  };
  return update(state, {
    hints: {
      $set: updateObj
    }
  });
}

function resetHintQueryReducer (state, _action) {
  return update(state, {
    hints: {
      $merge: {
        ...noSelection,
        hintQuery: undefined,
        hintObtained: false,
      }
    }
  });
}

function selectInGridReducer (state, action) {
  const {row, col, bigram, rank} = action;
  return update(state, {
    hints: {
      $merge: {
        ...noSelection,
        selectedRow: row,
        selectedCol: col,
        hintQuery: {
          type: 'subst-decipher',
          bigram: bigram,
          row: row,
          col: col
        },
        hintObtained: rank !== null
      }
    }
  });
}

function selectInAlphabetReducer (state, action) {
  const {letterRank, letter, bigram} = action;
  return update(state, {
    hints: {
      $merge: {
        ...noSelection,
        selectedLetterRank: letterRank,
        hintQuery: {
          type: 'subst-cipher',
          letter: letter,
          rank: letterRank
        },
        hintObtained: bigram !== null
      }
    }
  });
}

function selectInDecipherPermReducer (state, action) {
  const {fromLine, toLine} = action;
  return update(state, {
    hints: {
      $merge: {
        ...noSelection,
        selectedDecipherPos: fromLine,
        hintQuery: {
          type: 'perm-decipher',
          line: fromLine
        },
        hintObtained: toLine !== null
      }
    }
  });
}

function selectInCipherPermReducer (state, action) {
  const {fromLine, toLine} = action;
  return update(state, {
    hints: {
      $merge: {
        ...noSelection,
        selectedCipherPos: fromLine,
        hintQuery: {
          type: 'perm-cipher',
          line: fromLine
        },
        hintObtained: toLine !== null
      }
    }
  });
}

const shouldRun = (state, action) => {
  const {taskInit, taskRefresh} = state.actions;

  switch (action.type) {
    case taskInit:
    case taskRefresh:
      return true;
    default:
      return false;
  }
};

function lateReducer (state, action) {
  if (state.taskReady && shouldRun(state, action)) {
    const {bigramAlphabet, clearAlphabet, substitutionGridHints, permutationHints} = state;

    // Compute the substitution.
    const mapping = [];
    substitutionGridHints.forEach(function (row, _i) {
      row.forEach(function (l, _j) {
        mapping.push(l === null ? {q: 'unknown'} : {q: 'hint', l});
      });
    });

    const outputSubstitution = {
      mapping,
      sourceAlphabet: bigramAlphabet,
      targetAlphabet: clearAlphabet
    };
    // Compute the permutation.
    const outputPermutation = permutationHints.map(
      l => l === null ? {q: 'unknown'} : {q: 'hint', l});
    const inversePermutation = getInversePermutation(outputPermutation);

    state = update(state, {
      hints: {
        outputSubstitution: {$set: outputSubstitution},
        outputPermutation: {$set: outputPermutation},
        inversePermutation: {$set: inversePermutation},
      }
    });
  }
  return state;
}

export default {
  actions: {
    resetHintQuery: 'Task.Hints.ResetHintQuery',
    selectInGrid: 'Task.Hints.SelectInGrid',
    selectInAlphabet: 'Task.Hints.SelectInAlphabet',
    selectInDecipherPerm: 'Task.Hints.SelectInDecipherPerm',
    selectInCipherPerm: 'Task.Hints.SelectInCipherPerm'
  },
  actionReducers: {
    taskInit: taskInitReducer,
    resetHintQuery: resetHintQueryReducer,
    selectInGrid: selectInGridReducer,
    selectInAlphabet: selectInAlphabetReducer,
    selectInDecipherPerm: selectInDecipherPermReducer,
    selectInCipherPerm: selectInCipherPermReducer
  },
  saga: function* hintFeedbackClearSaga () {
    const actions = yield select(({actions: {
      hintRequestFeedbackCleared,
      resetHintQuery,
      selectInGrid,
      selectInAlphabet,
      selectInDecipherPerm,
      selectInCipherPerm,
    }}) => ({
      filters: [
        resetHintQuery,
        selectInGrid,
        selectInAlphabet,
        selectInDecipherPerm,
        selectInCipherPerm
      ],
      cleared: hintRequestFeedbackCleared
    }));
    yield takeEvery(actions.filters, function* () {
      yield put({type: actions.cleared});
    });
  },
  views: {
    Hints: connect(HintsSelector)(Hints)
  },
  lateReducer
};
