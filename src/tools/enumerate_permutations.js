import React from 'react';
import classnames from 'classnames';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import {Python} from '../ui';

import {
  bigramsFromText, coincidenceIndex, generatePermutations,
  comparePermutations, permutationFromString, applyPermutation,
  numbersAlphabet, getInversePermutation, renderPermutation,
  arePermutationsCompatible
} from '../utils';

class EnumeratePermutations extends React.PureComponent {
  constructor () {
    super();
    this.tbody = null;
    this.tr = null;
  }

  refTbody = (element) => {
    this.tbody = element;
    this.jumpToTr();
  }

  refTr = (element) => {
    this.tr = element;
    this.jumpToTr();
  }

  jumpToTr () {
    if (!this.tbody || !this.tr) {
      return;
    }
    const trTop = this.tr.offsetTop;
    const trBottom = trTop + this.tr.offsetHeight;
    const tbodyTop = this.tbody.scrollTop;
    const tbodyBottom = tbodyTop + this.tbody.offsetHeight;
    if (trTop > tbodyBottom || trBottom <= tbodyTop + 27)
      this.tbody.scrollTop = this.tr.offsetTop - 27;
  }

  onSelectPermutation = (event) => {
    const key = event.currentTarget.getAttribute('data-key');
    this.props.dispatch({type: this.props.selectPermutation, key});
  }

  onSetSortBy = (event) => {
    const key = event.currentTarget.getAttribute('data-key');
    this.props.dispatch({type: this.props.setSortBy, key});
  }

  onToggleFavorited = (event) => {
    const key = event.currentTarget.getAttribute('data-key');
    const infos = this.props.permutationInfos;
    const favorited = key in infos ? !infos[key].favorited : true;
    this.props.dispatch({type: this.props.setFavorited, key, favorited});
    event.stopPropagation();  // XXX is this necessary?
  }

  onToggleShowOnlyFavorited = (_event) => {
    const {showOnlyFavorited} = this.props;
    this.props.dispatch({type: this.props.setShowOnlyFavorited, value: !showOnlyFavorited});
  }

  renderInstructionPython = () => {
    const {outputPermutationVariable, inputPermutationVariable, inputCipheredTextVariable} = this.props;
    return (
      <Python.Assign>
        <Python.Var name={outputPermutationVariable} />
        <Python.Call name="énumèrePermutations">
          <Python.Var name={inputPermutationVariable} />
          <Python.Var name={inputCipheredTextVariable} />
          <span>…</span>
        </Python.Call>
      </Python.Assign>
    );
  }

  render () {
    const {showOnlyFavorited, useCoincidenceIndex, sortBy,
      selectedPermutation, permutations, prevPermutation, nextPermutation,
      // outputPermutationVariable, inputPermutationVariable, inputCipheredTextVariable
    } = this.props;

    const renderPermutationItem = (permutation, i) => {
      const isSelected = selectedPermutation === permutation;
      const classes = ['adfgx-perm', isSelected && 'adfgx-perm-selected'];
      const favoritedClasses = ['fa', permutation.favorited ? 'fa-toggle-on' : 'fa-toggle-off'];
      return (
        <tr key={i} className={classnames(classes)} data-key={permutation.key} onClick={this.onSelectPermutation} ref={isSelected && this.refTr}>
          <td className='adfgx-col-l'>{renderPermutation(permutation.qualified)}</td>
          <td className='adfgx-col-l'>{renderPermutation(permutation.inverse)}</td>
          {useCoincidenceIndex && <td className='adfgx-col-m'>{permutation.ci.toFixed(3)}</td>}
          <td className='adfgx-col-s' onClick={this.onToggleFavorited} data-key={permutation.key}><i className={classnames(favoritedClasses)} /></td>
        </tr>
      );
    };
    // const inputVars = [
    //   {label: "Permutation", name: inputPermutationVariable},
    //   {label: "Texte chiffré", name: inputCipheredTextVariable}
    // ];
    // const outputVars = [
    //   {label: "Nouvelle permutation", name: outputPermutationVariable}
    // ];

    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <span className='code'>
            {this.renderInstructionPython()}
          </span>
        </div>
        <div className='panel-body'>
          <table className='adfgx-table adfgx-table-scroll-body'>
            <thead>
              <tr>
                <th className={classnames(['adfgx-col-l', 'adfgx-col-sort', sortBy === 'permutation' && 'adfgx-col-sort-key'])} onClick={this.onSetSortBy} data-key='permutation'>permutation déchiffrage</th>
                <th className={classnames(['adfgx-col-l', 'adfgx-col-sort', sortBy === 'inverse' && 'adfgx-col-sort-key'])} onClick={this.onSetSortBy} data-key='inverse'>permutation chiffrage</th>
                {useCoincidenceIndex && <th className={classnames(['adfgx-col-m', 'adfgx-col-sort', sortBy === 'ci' && 'adfgx-col-sort-key'])} onClick={this.onSetSortBy} data-key='ci'>coïncidence (i)</th>}
                <th className='adfgx-col-s'>retenue</th>
              </tr>
            </thead>
            <tbody ref={this.refTbody}>
              {permutations.map(renderPermutationItem)}
            </tbody>
          </table>
          <div className='adfgx-controls'>
            <Button onClick={this.onToggleShowOnlyFavorited}>
              <i className={classnames(['fa', 'fa-toggle-' + (showOnlyFavorited ? 'on' : 'off')])} />
              {' retenues uniquement'}
            </Button>
            <Button onClick={this.onSelectPermutation} disabled={!prevPermutation} data-key={prevPermutation && prevPermutation.key}>
              <i className={classnames(['fa', 'fa-arrow-up'])} />
              {' permutation précédente'}
            </Button>
            <Button onClick={this.onSelectPermutation} disabled={!nextPermutation} data-key={nextPermutation && nextPermutation.key}>
              <i className={classnames(['fa', 'fa-arrow-down'])} />
              {' permutation suivante'}
            </Button>
          </div>
          <div>
            {'Permutation '}
            {permutations.indexOf(selectedPermutation) + 1}
            {' / '}
            {permutations.length}
          </div>
        </div>
      </div>
    );
  }
}


function EnumeratePermutationsSelector (state) {
  const {actions: {
    selectPermutation,
    setSortBy,
    setFavorited,
    setShowOnlyFavorited,
  }} = state;

  return {
    selectPermutation,
    setSortBy,
    setFavorited,
    setShowOnlyFavorited,
    ...state.enumeratePermutations
  };
}

function taskInitReducer (state, _action) {
  return update(state, {
    enumeratePermutations: {
      $set: {
        // sortBy may be 'ci' (coincidence index) or 'key' (permutation-as-string)
        useCoincidenceIndex: false,
        sortBy: 'permutation',
        // selectedPermutationKey is a permutation-as-string, e.g. '012345';
        // if undefined (or if the selected permutation is filtered out), the
        // first permutation displayed is selected.
        selectedPermutationKey: undefined,
        // permutationInfos maps a permutation-as-string to a {favorited: bool} object.
        permutationInfos: {},
        // showOnlyFavorited, when true, limits the display to favorited permutations.
        showOnlyFavorited: false,
        inputPermutationVariable: 'permutationIndices',
        inputCipheredTextVariable: 'texteChiffré',
        outputPermutationVariable: 'permutationCourante',
        permutationsBackUp: []
      }
    }
  });
}


const shouldRun = (state, action) => {
  const {
    taskInit, taskRefresh,
    selectPermutation, setSortBy, setFavorited, setShowOnlyFavorited,
  } = state.actions;

  switch (action.type) {
    case taskInit:
    case taskRefresh:
    case selectPermutation:
    case setSortBy:
    case setFavorited:
    case setShowOnlyFavorited:
      return true;
    default:
      return false;
  }
};


function lateReducer (state, action) {
  if (state.taskReady && shouldRun(state, action)) {

    const inputPermutation = state.hints.outputPermutation;
    const cipheredText = state.textInput.outputText;
    const {
      selectedPermutationKey,
      permutationInfos,
      showOnlyFavorited,
      useCoincidenceIndex,
      sortBy
    } = state.enumeratePermutations;
    // showOnlyFavorited disables the generation of permutations.
    let permutations = [];  // {key,qualified,favorited}
    let permutationsBackUp = state.enumeratePermutations.permutationsBackUp;
    const permutationMap = {};  // key → {key,qualified,favorited}
    if (!showOnlyFavorited) {

      const {taskInit, taskRefresh} = state.actions;
      switch (action.type) {
        case taskInit:
        case taskRefresh:
          permutations = generatePermutations(inputPermutation, numbersAlphabet);
          permutationsBackUp = permutations;
          break;
        default:
          permutations = permutationsBackUp;
          break;
      }

      permutations.forEach(function (permutation) {
        permutationMap[permutation.key] = permutation;
      });
    }
    // Add all favorited permutations that do not conflict with the input.
    Object.keys(permutationInfos).forEach(function (key) {
      const infos = permutationInfos[key];
      if (key in permutationMap) {
        // Permutation was generated above, just fill in favorited flag.
        permutationMap[key].favorited = infos.favorited;
      } else {
        // Filter out non-favorited (avoids having de-favorited permutations
        // stick around after the user has obtained hints).
        if (!infos.favorited)
          return;
        // Add the permutation to the output, if compatible with the input.
        const permutation = permutationFromString(key, inputPermutation);
        if (arePermutationsCompatible(inputPermutation, permutation)) {
          permutations.push({
            key: key,
            qualified: permutation,
            favorited: true
          });
        }
      }
    });
    // Compute stats and inverse on each permutation.
    permutations.forEach(function (permutation) {
      const permText = applyPermutation(cipheredText, permutation.qualified);
      const bigramText = bigramsFromText(permText);
      if (useCoincidenceIndex)
        permutation.ci = coincidenceIndex(bigramText);
      permutation.inverse = getInversePermutation(permutation.qualified);
    });
    // Sort the permutations.
    if (useCoincidenceIndex && sortBy === 'ci') {
      permutations.sort(function (p1, p2) {
        const result = p1.ci < p2.ci ? 1 : (p1.ci > p2.ci ? -1 :
          comparePermutations(p1.qualified, p2.qualified));
        return result;
      });
    } else if (sortBy === 'inverse') {
      permutations.sort(function (p1, p2) {
        return comparePermutations(p1.inverse, p2.inverse);
      });
    } else {
      permutations.sort(function (p1, p2) {
        return comparePermutations(p1.qualified, p2.qualified);
      });
    }

    const updateObj = {
      permutationsBackUp: {$set: permutationsBackUp}
    };
    updateObj.permutations = {$set: permutations};
    // Find the selected permutation (use the first one if not found).
    let selectedPermutationIndex = permutations.findIndex(function (p) {
      return p.key == selectedPermutationKey;
    });
    if (selectedPermutationIndex === -1) {selectedPermutationIndex = 0;}
    if (selectedPermutationIndex !== 0) {
      updateObj.prevPermutation = {$set: permutations[selectedPermutationIndex - 1]};
    }
    if (selectedPermutationIndex + 1 !== permutations.length) {
      updateObj.nextPermutation = {$set: permutations[selectedPermutationIndex + 1]};
    }
    const selectedPermutation = permutations[selectedPermutationIndex];
    updateObj.selectedPermutation = {$set: selectedPermutation};
    // Output a qualified permutation.
    if (selectedPermutation)
      updateObj.outputPermutation = {$set: selectedPermutation.qualified};

    state = update(state, {
      enumeratePermutations: updateObj
    });
  }
  return state;
}


function selectPermutationReducer (state, action) {
  const {key} = action;
  return update(state, {
    enumeratePermutations: {
      selectedPermutationKey: {$set: key}
    }
  });
}

function setSortByReducer (state, action) {
  const {key} = action;
  return update(state, {
    enumeratePermutations: {
      sortBy: {$set: key}
    }
  });
}

function setFavoritedReducer (state, action) {
  const {key, favorited} = action;
  const infos = state.enumeratePermutations.permutationInfos;
  const value = {...infos[key], favorited};
  return update(state, {
    enumeratePermutations: {
      permutationInfos: {$set: {...infos, [key]: value}}
    }
  });
}

function setShowOnlyFavoritedReducer (state, action) {
  const {value} = action;
  return update(state, {
    enumeratePermutations: {
      showOnlyFavorited: {$set: value}
    }
  });
}

export default {
  actions: {
    selectPermutation: 'Task.EnumeratePermutations.SelectPermutation',
    setSortBy: 'Task.EnumeratePermutations.SetSortBy',
    setFavorited: 'Task.EnumeratePermutations.SetFavorited',
    setShowOnlyFavorited: 'Task.EnumeratePermutations.SetShowOnlyFavorited'
  },
  actionReducers: {
    taskInit: taskInitReducer,
    selectPermutation: selectPermutationReducer,
    setSortBy: setSortByReducer,
    setFavorited: setFavoritedReducer,
    setShowOnlyFavorited: setShowOnlyFavoritedReducer,
  },
  views: {
    EnumeratePermutations: connect(EnumeratePermutationsSelector)(EnumeratePermutations)
  },
  lateReducer
};
