import React from 'react';
import EpicComponent from 'epic-component';
import {Python, Variables} from 'alkindi-task-lib/ui';

import {renderText} from './common';

export const Component = EpicComponent(self => {

   self.render = function() {
      const {inputTextVariable, inputSubstitutionVariable, outputClearTextVariable} = self.props.state;
      const {outputText} = self.props.scope;
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>
               <span className='code'>
                  <Python.Assign>
                     <Python.Var name={outputClearTextVariable}/>
                     <Python.Call name="appliqueSubstitution">
                        <Python.Var name={inputTextVariable}/>
                        <Python.Var name={inputSubstitutionVariable}/>
                     </Python.Call>
                  </Python.Assign>
               </span>
            </div>
            <div className='panel-body'>
               <div className='adfgx-deciphered-text'>
                  {renderText(outputText)}
               </div>
            </div>
         </div>
      );
   };

});

export const compute = function (state, scope) {
   const {cipheredText, substitution} = scope;
   const targetCells = cipheredText.cells.map(function (cell) {
      return substitution.mapping[cell.l];
   });
   scope.outputText = {alphabet: substitution.targetAlphabet, cells: targetCells};
};

export default function ApplySubstitution () {
   this.Component = Component;
   this.compute = compute;
};
