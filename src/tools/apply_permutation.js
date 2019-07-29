import React from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import {Python} from '../ui';

import {bigramsFromText, applyPermutation, renderCell} from '../utils';


class ApplyPermutation extends React.PureComponent {

  renderBigram (key, bigram, halfabet) {
    return (
      <div key={key} className="adfgx-bigram">
        {renderCell(0, bigram.c0, halfabet)}
        {renderCell(1, bigram.c1, halfabet)}
      </div>
    );
  }

  renderText = () => {
    const {cells, halfabet} = this.props.outputText;
    const columns = [];
    let column = [];
    cells.forEach((bigram, _iBigram) => {
      column.push(this.renderBigram(column.length, bigram, halfabet));
      if (column.length === 3) {
        columns.push(<div key={columns.length} className="adfgx-column">{column}</div>);
        column = [];
      }
    });
    return <div className='adfgx-columns'>{columns}</div>;
  }

  renderInstructionPython = () => {
    const {inputPermutationVariable, inputCipheredTextVariable, outputTextVariable} = this.props;
    return (
      <Python.Assign>
        <Python.Var name={outputTextVariable} />
        <Python.Call name="appliquePermutation">
          <Python.Var name={inputPermutationVariable} />
          <Python.Var name={inputCipheredTextVariable} />
        </Python.Call>
      </Python.Assign>
    );
  }

  render () {
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <span className='code'>
            {this.renderInstructionPython()}
          </span>
        </div>
        <div className='panel-body'>
          {this.renderText()}
        </div>
      </div>
    );
  }
}


function ApplyPermutationSelector (state) {
  return state.applyPermutation;
}

function taskInitReducer (state, _action) {
  return update(state, {
    applyPermutation: {
      $set: {
        inputPermutationVariable: 'permutationCourante',
        inputCipheredTextVariable: 'texteChiffré',
        outputTextVariable: 'texteAprèsPermutation'
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

    const permutation = state.enumeratePermutations.outputPermutation;
    const cipheredText = state.textInput.outputText;
    const permText = permutation ? applyPermutation(cipheredText, permutation) : cipheredText;
    const outputText = bigramsFromText(permText);

    state = update(state, {
      applyPermutation: {
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
    ApplyPermutation: connect(ApplyPermutationSelector)(ApplyPermutation)
  },
  lateReducer
};
