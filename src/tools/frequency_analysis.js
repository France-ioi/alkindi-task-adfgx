import React from 'react';
import {connect} from 'react-redux';
import update from 'immutability-helper';
import {Button} from 'react-bootstrap';
import classnames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import {Python} from '../ui';

import {getQualifierClass, getFrequencies} from '../utils';

const BareSubstTarget = function (props) {
  const {target, targetAlphabet, targetFrequency, barScale} = props;
  const {isDragging, connectDropTarget, connectDragSource} = props;
  const isDragTarget = typeof connectDropTarget === 'function';
  const isDragSource = typeof connectDragSource === 'function';
  const targetSymbol = targetAlphabet.symbols[target.l];
  const classes = ['adfgx-subst-tgt', isDragSource && 'adfgx-draggable', isDragging && 'dragging'];
  let el = (
    <div className={classnames(classes)}>
      <span className='adfgx-subst-char'>{targetSymbol}</span>
      <span className='adfgx-subst-freq' title={(targetFrequency * 100).toFixed(1) + '%'}><span style={{height: (targetFrequency * barScale).toFixed(1) + 'px'}}></span></span>
    </div>
  );
  if (isDragTarget)
    el = connectDropTarget(el);
  if (isDragSource)
    el = connectDragSource(el);
  return el;
};


function sourceCollect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}
const targetCollect = function (connect, _monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
};
const sourceSpec = {
  beginDrag: function (props) {
    const {source, target} = props;
    return {source, target};
  }
};
const targetSpec = {
  drop: function (props, monitor, _component) {
    const dragSource = monitor.getItem();
    const {source, target} = props;
    const dragTarget = {source, target};
    props.onDrop(dragSource, dragTarget);
  }
};
const SubstTarget =
  DragSource('adfgx-subst-target', sourceSpec, sourceCollect)(
    DropTarget('adfgx-subst-target', targetSpec, targetCollect)(
      BareSubstTarget));

class FrequencyAnalysis extends React.PureComponent {

  onDrop = (dragSource, dragTarget) => {
    const {sourceAlphabet: bigramAlphabet, targetAlphabet} = this.props.outputSubstitution;
    const key1 = bigramAlphabet.symbols[dragTarget.source.l];
    const value1 = targetAlphabet.symbols[dragSource.target.l];
    const key2 = bigramAlphabet.symbols[dragSource.source.l];
    const value2 = targetAlphabet.symbols[dragTarget.target.l];
    this.props.dispatch({type: this.props.swapPairs, key1, value1, key2, value2});
  }

  onReset = () => {
    this.props.dispatch({type: this.props.reset});
  }

  renderInstructionPython = () => {
    const {outputSubstitutionVariable, inputTextVariable, inputSubstitutionVariable} = this.props;
    return (
      <Python.Assign>
        <Python.Var name={outputSubstitutionVariable} />
        <Python.Call name="analyseFréquence">
          <Python.Var name={inputTextVariable} />
          <Python.Var name={inputSubstitutionVariable} />
          <span>…</span>
        </Python.Call>
      </Python.Assign>
    );
  }

  render () {
    const {
      inputTextVariable, inputSubstitutionVariable, outputSubstitutionVariable,
      bigramFreqs, outputSubstitution, targetFrequencies
    } = this.props;

    const {sourceAlphabet: bigramAlphabet, targetAlphabet, substitution} = outputSubstitution;
    const barScale = 42 / Math.max.apply(null, targetFrequencies);
    const inputVars = [
      {label: "Texte chiffré", name: inputTextVariable},
      {label: "Substitution d'entrée", name: inputSubstitutionVariable}
    ];
    const outputVars = [
      {label: "Substitution", name: outputSubstitutionVariable}
    ];
    const renderBigramHisto = (bigram) => {
      const targetCell = substitution[bigram.l];
      const symbol = bigramAlphabet.symbols[bigram.l];
      const isEditable = targetCell.q === 'unknown' || targetCell.q === 'guess';
      const Target = isEditable ? SubstTarget : BareSubstTarget;
      return (
        <div key={bigram.l} className={classnames(['adfgx-subst-pair', getQualifierClass(targetCell.q)])}>
          <div className='adfgx-subst-src'>
            <span className='adfgx-subst-freq' title={(bigram.p * 100).toFixed(1) + '%'}><span style={{height: (bigram.p * barScale).toFixed(1) + 'px'}}></span></span>
            <span className='adfgx-subst-chars'>
              <span>{symbol[0]}</span>
              <span>{symbol[1]}</span>
            </span>
          </div>
          <Target source={bigram} target={targetCell} targetAlphabet={targetAlphabet} targetFrequency={targetFrequencies[targetCell.l]} barScale={barScale} onDrop={this.onDrop} />
        </div>
      );
    };
    // Button to reset substitution to match order of bigrams frequencies
    // with order of letter frequencies in french.
    return (
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <span className='code'>
            {this.renderInstructionPython()}
          </span>
        </div>
        <div className='panel-body'>
          {false && <Variables inputVars={inputVars} outputVars={outputVars} />}
          <Button onClick={this.onReset}>réinitialiser</Button>
          <div className='grillesSection'>
            <div className='adfgx-freq-labels'>
              <div className='adfgx-freq-label-freq-src'><span>Fréquences dans le texte : </span></div>
              <div className='adfgx-freq-label-symb-src'><span>Symboles du texte : </span></div>
              <div className='adfgx-freq-label-symb-tgt'><span>Substitutions : </span></div>
              <div className='adfgx-freq-label-freq-tgt'><span>Fréquences en français : </span></div>
            </div>
            <div className='adfgx-subst'>
              {bigramFreqs.map(renderBigramHisto)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function FrequencyAnalysisSelector (state) {
  const {actions: {swapPairs, reset}} = state;
  return {swapPairs, reset, ...state.frequencyAnalysis};
}

function taskInitReducer (state, _action) {
  return update(state, {
    frequencyAnalysis: {
      $set: {
        editedPairs: {}, // ex. {'AD': 'E'}
        targetFrequencies: referenceLetterFrequencies,
        inputTextVariable: 'texteAprèsPermutation',
        inputSubstitutionVariable: 'substitutionIndices',
        outputSubstitutionVariable: 'substitutionÉditée'
      }
    }
  });
}

function swapPairsReducer (state, action) {
  const {editedPairs} = state.frequencyAnalysis;
  const {key1, value1, key2, value2} = action;
  return update(state, {
    frequencyAnalysis: {
      editedPairs: {$set: {...editedPairs, [key1]: value1, [key2]: value2}}
    }
  });
}

function resetReducer (state, _action) {
  return update(state, {
    frequencyAnalysis: {
      editedPairs: {$set: {}}
    }
  });
}


const referenceLetterFrequencies = [
  0.0812034849,
  0.0090109472,
  0.0334497677,
  0.0366833299,
  0.1713957515,
  0.0106596728,
  0.0086628177,
  0.0073654812,
  0.0757827046,
  0.0054442497,
  0.0004856863,
  0.0545455020,
  0.0296764091,
  0.0709375766,
  0.0540474291,
  0.0302070784,
  0.0136181215,
  0.0655187521,
  0.0794667491,
  0.0724311434,
  0.0636770558,
  0.0174208168,
  0.0038646285,
  0.0030803592,
  0.0013644851
];



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
    const {bigramAlphabet, clearAlphabet: targetAlphabet} = state;
    const cipheredText = state.applyPermutation.outputText;
    // const permutation = state.enumeratePermutations.outputPermutation;
    const inputSubstitution = state.hints.outputSubstitution;
    const {editedPairs, targetFrequencies} = state.frequencyAnalysis;

    // Compute bigram frequencies.
    const bigramFreqs = getFrequencies(cipheredText);
    // Mark symbols in inputSubstitution and editedPairs as used, other target
    // symbols as unused.
    const symbolUsed = Array(bigramAlphabet.size).fill(false);
    Object.keys(editedPairs).forEach(function (bigram) {
      // Ignore editedPairs that are overridden by a hint.
      const bigramRank = bigramAlphabet.ranks[bigram];
      if (inputSubstitution.mapping[bigramRank].l === undefined) {
        const rank = targetAlphabet.ranks[editedPairs[bigram]];
        symbolUsed[rank] = 'edit';
      }
    });
    inputSubstitution.mapping.forEach(function (cell) {
      if (cell.l !== undefined)
        symbolUsed[cell.l] = 'hint';
    });
    // Build a list of unused ranks in target alphabet sorted by decreasing target frequency.
    const sortedFrequencies = Array(targetFrequencies.size);
    targetFrequencies.forEach(function (p, i) {
      sortedFrequencies[i] = {p, i};
    });
    sortedFrequencies.sort(function byProbability (a, b) {
      return a.p > b.p ? -1 : (a.p < b.p ? 1 : 0);
    });
    const unusedRanks = [];
    sortedFrequencies.forEach(function (a) {
      const rank = a.i;
      if (!symbolUsed[rank])
        unusedRanks.push(rank);
    });
    // Generate a substitution using editedPairs and filling with the stats.
    let nextUnusedRankPos = 0;
    const substitution = inputSubstitution.mapping.slice();
    bigramFreqs.forEach(function (bigram) {
      if (substitution[bigram.l].q !== 'unknown')
        return;
      const symbol = bigramAlphabet.symbols[bigram.l];
      let targetRank, qualifier;
      if (symbol in editedPairs) {
        // If there is a hint that maps to this letter, ignore the edit.
        targetRank = targetAlphabet.ranks[editedPairs[symbol]];
        if (symbolUsed[targetRank] !== 'hint') {
          qualifier = 'guess';  // XXX or locked
        }
      }
      if (qualifier === undefined) {
        targetRank = unusedRanks[nextUnusedRankPos];
        nextUnusedRankPos += 1;
        qualifier = 'unknown';
      }
      substitution[bigram.l] = {l: targetRank, q: qualifier};
    });

    const outputSubstitution = {
      sourceAlphabet: bigramAlphabet,
      targetAlphabet: targetAlphabet,
      substitution
    };

    state = update(state, {
      frequencyAnalysis: {
        bigramFreqs: {$set: bigramFreqs},
        outputSubstitution: {$set: outputSubstitution},
      }
    });
  }
  return state;
}

export default {
  actions: {
    swapPairs: 'Task.FrequencyAnalysis.SwapPairs',
    reset: 'Task.FrequencyAnalysis.Reset'
  },
  actionReducers: {
    taskInit: taskInitReducer,
    swapPairs: swapPairsReducer,
    reset: resetReducer
  },
  views: {
    FrequencyAnalysis: connect(FrequencyAnalysisSelector)(FrequencyAnalysis)
  },
  lateReducer
};
