import React from 'react';
import {Button} from 'react-bootstrap';
import EpicComponent from 'epic-component';
import classnames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import {Python, Variables} from 'alkindi-task-lib/ui';

import {getQualifierClass, getFrequencies, applySubstitutionToText} from './common';

const BareSubstTarget = EpicComponent(self => {
   self.render = function () {
      const {source, target, targetAlphabet, targetFrequency, barScale} = self.props;
      const {isDragging, connectDropTarget, connectDragSource} = self.props;
      const isDragTarget = typeof connectDropTarget === 'function';
      const isDragSource = typeof connectDragSource === 'function';
      const targetSymbol = targetAlphabet.symbols[target.l];
      const classes = ['adfgx-subst-tgt', isDragSource && 'adfgx-draggable', isDragging && 'dragging']
      let el = (
         <div className={classnames(classes)}>
            <span className='adfgx-subst-char'>{targetSymbol}</span>
            <span className='adfgx-subst-freq' title={(targetFrequency * 100).toFixed(1)+'%'}><span style={{height: (targetFrequency * barScale).toFixed(1)+'px'}}></span></span>
         </div>
      );
      if (isDragTarget)
         el = connectDropTarget(el);
      if (isDragSource)
         el = connectDragSource(el);
      return el;
   };
});

function sourceCollect (connect, monitor) {
   return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
   };
};
const targetCollect = function (connect, monitor) {
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
   drop: function (props, monitor, component) {
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

export const Component = EpicComponent(self => {

   const onDrop = function (dragSource, dragTarget) {
      const {bigramAlphabet, targetAlphabet} = self.props.scope;
      const key1 = bigramAlphabet.symbols[dragTarget.source.l];
      const value1 = targetAlphabet.symbols[dragSource.target.l];
      const key2 = bigramAlphabet.symbols[dragSource.source.l];
      const value2 = targetAlphabet.symbols[dragTarget.target.l];
      self.props.dispatch({type: 'SwapPairs', key1, value1, key2, value2});
   };

   const onReset = function () {
      self.props.dispatch({type: 'Reset'});
   };

   self.render = function() {
      const {inputTextVariable, inputSubstitutionVariable, outputSubstitutionVariable} = self.props.state;
      const {bigramFreqs, bigramAlphabet, targetAlphabet, outputSubstitution, targetFrequencies} = self.props.scope;
      const substitution = outputSubstitution.mapping;
      const barScale = 42 / Math.max.apply(null, targetFrequencies);
      const inputVars = [
         {label: "Texte chiffré", name: inputTextVariable},
         {label: "Substitution d'entrée", name: inputSubstitutionVariable}
      ];
      const outputVars = [
         {label: "Substitution", name: outputSubstitutionVariable}
      ];
      const renderBigramHisto = function (bigram) {
         const targetCell = substitution[bigram.l];
         const symbol = bigramAlphabet.symbols[bigram.l];
         const isEditable = targetCell.q === 'unknown' || targetCell.q === 'guess';
         const Target = isEditable ? SubstTarget : BareSubstTarget;
         return (
            <div key={bigram.l} className={classnames(['adfgx-subst-pair', getQualifierClass(targetCell.q)])}>
               <div className='adfgx-subst-src'>
                  <span className='adfgx-subst-freq' title={(bigram.p * 100).toFixed(1)+'%'}><span style={{height: (bigram.p * barScale).toFixed(1)+'px'}}></span></span>
                  <span className='adfgx-subst-chars'>
                     <span>{symbol[0]}</span>
                     <span>{symbol[1]}</span>
                  </span>
               </div>
               <Target source={bigram} target={targetCell} targetAlphabet={targetAlphabet} targetFrequency={targetFrequencies[targetCell.l]} barScale={barScale} onDrop={onDrop} />
            </div>
         );
      };
      // Button to reset substitution to match order of bigrams frequencies
      // with order of letter frequencies in french.
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>
               <span className='code'>
                  <Python.Assign>
                     <Python.Var name={outputSubstitutionVariable}/>
                     <Python.Call name="analyseFréquence">
                        <Python.Var name={inputTextVariable}/>
                        <Python.Var name={inputSubstitutionVariable}/>
                        <span>…</span>
                     </Python.Call>
                  </Python.Assign>
               </span>
            </div>
            <div className='panel-body'>
               {false && <Variables inputVars={inputVars} outputVars={outputVars} />}
               <Button onClick={onReset}>réinitialiser</Button>
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
   };

});

export const compute = function (state, scope) {
   const {targetAlphabet, bigramAlphabet, cipheredText, targetFrequencies, inputSubstitution} = scope;
   const {editedPairs} = state;
   // Compute bigram frequencies.
   scope.bigramFreqs = getFrequencies(cipheredText);
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
         unusedRanks.push(rank)
   });
   // Generate a substitution using editedPairs and filling with the stats.
   let nextUnusedRankPos = 0;
   const substitution = inputSubstitution.mapping.slice();
   scope.bigramFreqs.forEach(function (bigram) {
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
   scope.outputSubstitution = {
      sourceAlphabet: bigramAlphabet,
      targetAlphabet: targetAlphabet,
      mapping: substitution
   };
};

export default function FrequencyAnalysis () {
   this.Component = Component;
   this.compute = compute;
   this.reducers = {};
   this.reducers.SwapPairs = function (state, action) {
      const {editedPairs} = state;
      const {key1, value1, key2, value2} = action;
      const pairs = state
      return {
         ...state,
         editedPairs: {...editedPairs, [key1]: value1, [key2]: value2}
      };
   };
   this.reducers.Reset = function (state, action) {
      return {...state, editedPairs: {}};
   };
};
