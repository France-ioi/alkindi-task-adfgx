import React from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import {Python, Variables} from '../ui';
import {cellsFromString, renderText} from '../utils';

/*

Persistent state:

   outputTextVariable

Scope inputs:

   alphabet
   text

Scope outputs:

   outputText

*/



class TextInput extends React.PureComponent {

  renderInstructionPython = () => {
    const {outputTextVariable, text} = this.props;
    return (
      <Python.Assign>
        <Python.Var name={outputTextVariable} />
        <Python.StrLit value={text} />
      </Python.Assign>
    );
  }

  render () {
    const {outputTextVariable, outputText} = this.props;
    const inputVars = [];
    const outputVars = [{label: "Texte chiffré", name: outputTextVariable}];
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <span className='code'>
            {this.renderInstructionPython()}
          </span>
        </div>
        <div className='panel-body'>
          { <Variables inputVars={inputVars} outputVars={outputVars} />}
          <div className='adfgx-text-input'>{renderText(outputText)}</div>
        </div>
      </div>
    );
  }
}



function TextInputSelector (state) {
  return state.textInput;
}

function taskInitReducer (state, _action) {
  const {adfgxAlphabet: alphabet, cipheredText: text} = state;
  const cells = cellsFromString(text, alphabet);
  const outputText = {alphabet, cells};

  return update(state, {
    textInput: {
      $set: {
        outputTextVariable: "texteChiffré",
        outputText: outputText
      }
    }
  });
}

function lateReducer (state) {
  if (state.taskReady) {
    const {adfgxAlphabet: alphabet} = state;
    const {text} = state.textInput;
    const cells = cellsFromString(text, alphabet);
    const outputText = {alphabet, cells};

    state = update(state, {
      textInput: {
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
    TextInput: connect(TextInputSelector)(TextInput)
  },
  // lateReducer
};
