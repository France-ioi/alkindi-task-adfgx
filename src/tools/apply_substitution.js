import React from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import {Python} from '../ui';

import {renderText} from '../utils';

class ApplySubstitution extends React.PureComponent {

  renderInstructionPython = () => {
    const {inputTextVariable, inputSubstitutionVariable, outputClearTextVariable} = this.props;
    return (
      <Python.Assign>
        <Python.Var name={outputClearTextVariable} />
        <Python.Call name="appliqueSubstitution">
          <Python.Var name={inputTextVariable} />
          <Python.Var name={inputSubstitutionVariable} />
        </Python.Call>
      </Python.Assign>
    );
  }

  render () {
    const {outputText} = this.props;
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <span className='code'>
            {this.renderInstructionPython()}
          </span>
        </div>
        <div className='panel-body'>
          <div className='adfgx-deciphered-text'>
            {renderText(outputText)}
          </div>
        </div>
      </div>
    );
  }
}


function ApplySubstitutionSelector (state) {
  return state.applySubstitution;
}

function taskInitReducer (state, _action) {
  return update(state, {
    applySubstitution: {
      $set: {
        inputTextVariable: 'texteAprèsPermutation',
        inputSubstitutionVariable: 'substitutionÉditée',
        outputClearTextVariable: 'texteDéchiffré'
      }
    }
  });
}

const shouldRun = (state, action) => {
  const {
    taskInit, taskRefresh,
    selectPermutation, setSortBy, setFavorited, setShowOnlyFavorited,
    swapPairs, reset
  } = state.actions;

  switch (action.type) {
    case taskInit:
    case taskRefresh:
    case selectPermutation:
    case setSortBy:
    case setFavorited:
    case setShowOnlyFavorited:
    case swapPairs:
    case reset:
      return true;
    default:
      return false;
  }
};


function lateReducer (state, action) {
  if (state.taskReady && shouldRun(state, action)) {
    const cipheredText = state.applyPermutation.outputText;
    const {targetAlphabet, substitution} = state.frequencyAnalysis.outputSubstitution;

    const targetCells = cipheredText.cells.map(function (cell) {
      return substitution[cell.l];
    });

    const outputText = {alphabet: targetAlphabet, cells: targetCells};

    state = update(state, {
      applySubstitution: {
        outputText: {$set: outputText},
      }
    });
  }
  return state;
}

export default {
  actionReducers: {
    taskInit: taskInitReducer,
  },
  views: {
    ApplySubstitution: connect(ApplySubstitutionSelector)(ApplySubstitution)
  },
  lateReducer
};

