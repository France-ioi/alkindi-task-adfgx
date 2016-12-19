import React from 'react';
import EpicComponent from 'epic-component';
import classnames from 'classnames';
import {Python, Variables} from 'alkindi-task-lib/ui';

import {bigramsFromText, applyPermutation, renderCell} from './common';

export const Component = EpicComponent(self => {

   const renderBigram = function (key, bigram, halfabet) {
      return (
         <div key={key} className="adfgx-bigram">
            {renderCell(0, bigram.c0, halfabet)}
            {renderCell(1, bigram.c1, halfabet)}
         </div>
      );
   };

   const renderText = function (text) {
      const {cells, halfabet} = text;
      const columns = [];
      let column = [];
      cells.forEach(function (bigram, iBigram) {
         column.push(renderBigram(column.length, bigram, halfabet));
         if (column.length === 3) {
            columns.push(<div key={columns.length} className="adfgx-column">{column}</div>);
            column = [];
         }
      });
      return <div className='adfgx-columns'>{columns}</div>;
   };

   self.render = function() {
      const {inputPermutationVariable, inputCipheredTextVariable, outputTextVariable} = self.props.state;
      const {alphabet, outputText} = self.props.scope;
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>
               <span className='code'>
                  <Python.Assign>
                     <Python.Var name={outputTextVariable}/>
                     <Python.Call name="appliquePermutation">
                        <Python.Var name={inputPermutationVariable}/>
                        <Python.Var name={inputCipheredTextVariable}/>
                     </Python.Call>
                  </Python.Assign>
               </span>
            </div>
            <div className='panel-body'>
               {renderText(outputText, alphabet)}
            </div>
         </div>
      );
   };

});

export const compute = function (state, scope) {
   const {permutation, cipheredText, adfgxAlphabet} = scope;
   const permText = permutation ? applyPermutation(cipheredText, permutation) : cipheredText;
   scope.outputText = bigramsFromText(permText);
};

export default function ApplyPermutation () {
   this.Component = Component;
   this.compute = compute;
};
