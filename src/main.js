/* Platformless task driver */

import React from 'react';
import ReactDOM from 'react-dom';
import {Alert, Button} from 'react-bootstrap';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import EpicComponent from 'epic-component';

import * as WorkspaceManager from './workspace';
import reducer from './reducer';

// import {at, put} from './misc';

import 'normalize.css';
import 'font-awesome/css/font-awesome.css';
import 'rc-tooltip/assets/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

const initialTask = {
   // p. dech. 631524 (ch. LUHYPF)
   // subst. par freq. EATISNRUOLDCVMPFBXGHQJYZK
   // grille: AHVNR LIFTD PKXMO UCBQS JGYEZ
   // texte: NOTREPLANCOMMENCEDEFACONFORMIDABLEETJETI…
   substitution_grid: [[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null],[null,null,null,null,null]],
   permutation: [null, null, null, null, null, null],
   hints: {
      substitution_grid: [[0, 7, 21, 13, 17], [11, 8, 5, 19, 3], [15, 10, 22, 12, 14], [20, 2, 1, 16, 18], [9, 6, 23, 4, 24]],
      permutation: [5, 2, 0, 4, 1, 3],
   },
   cipher_text: "GAGGGXAGXXAGGGFXADXDXXXAGDGGDGGAGAXGGGDGXXGAGAAAGGXADGGAXGFGXGFGXAAGFXGADXXXGGGAGDXADGDXXAGGXGAGAAGGAXGGXGXAFGDGGAAXGDXGXAXAAFXGXXGAGXAGDXADXDGAAXXAADGGFGFXAFXXDFFDGXXXAGXGXFDAXADDAGGADDAFDDXFGAXAADDAGADFDXADGGGDFAXXGXAAXDADDDXGXGADDDAAGDADADAGFXXAAGGADXDFDAADADDDGFDADAGFDAAXADDXGDXDFFAXFDGXGDAXGDFGAAFGAGXGAADGFGXGDFAXXDGFDDDAGADXAGXGGDGADFAGDAGADXDFADXDAGGDDDAXDXDDDFADXXADDFAGAAGGDDDXADXXFFDDAGAGDDDDXDADXGXAAXGFFDAGDDDFGAFXXGDAFGFGAXADGDDDGDXGFDXXGFADAGADADDFAFADAAADDDDAAGDDADDGGAXDXXDXXAXGFXDXDADFXAXFGAXAGADXAAGXDXGDFDAAAAAAAGAGGGAXXAAXGGDXGFFAAAAXDDGAXFADXXAXFGXXDXXGGFFDGXFAGAAGAXDFAAXAGXDDADGGFAFAFGDXAXDXGXADGDGDFGAGADXXFDGFDAADGXDXGAXADAXAAAXFGGGAGGGDGDXGDGXGDGAFXGAXGGXFXXAXGAXAGGAGFGGGAFAGGAFXGDADGDGXGAGXXGAAGGXAGGAGAAGGXXDAADXXXGXGDGGGXGGDXXGGAXADGAXXGDXGAXGGFXXDFGGGAAGDGXDGGXXAGDAXGFXXGGGAAAGGXAAAXFGXDGGDAFXXXXGGAGXXGDADDDGAGFADAGAAAXXXADGXXGGGAXXFGGGFGXAAXDAGFGADDFXFDXFDGAAGADGGXXDGXXAGXGGGXGFAFXAXAFGD"
};

const findInGrid = function (grid, rank) {
   for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
         if (grid[row][col] === rank) {
            return {row, col};
         }
      }
   }
};

const BareDemoSelector = function (state) {
   const {score, task, workspace, unsavedChanges, rootScope} = state;
   return {score, task, workspace, unsavedChanges, rootScope};
};

const BareDemo = EpicComponent(self => {

   const assetUrl = function (path) {
      return `/assets/${path}`;
   };

   self.render = function () {
      // return <Task.Task task={task} assetUrl={assetUrl}/>
      const {task, rootScope, workspace, unsavedChanges, dispatch} = self.props;
      if (!task) {
         return <p>Task is not loaded.</p>;
      }
      if (!workspace) {
         return <p>Workspace not initialized.</p>;
      }
      return (
         <div>
            {unsavedChanges && <p>There are unsaved changes.</p>}
            <WorkspaceManager.View workspace={workspace} rootScope={rootScope} dispatch={dispatch}/>
         </div>
      );
   };

});

const Demo = DragDropContext(HTML5Backend)(connect(BareDemoSelector)(BareDemo));

/*
   const getHint = function (query, callback) {
      setTimeout(function () {
         const {task} = self.props;
         const {hints} = task;
         let newTask = task;
         if (query.type === 'subst-decipher') {
            const {row, col} = query;
            newTask = {...task, substitution_grid: at(row, at(col, put(hints.substitution_grid[row][col])))(task.substitution_grid)};
         } else if (query.type === 'subst-cipher') {
            const {row, col} = findInGrid(hints.substitution_grid, query.rank);
            newTask = {...task, substitution_grid: at(row, at(col, put(hints.substitution_grid[row][col])))(task.substitution_grid)};
         } else if (query.type === 'perm-decipher') {
            const {line} = query;
            newTask = {...task, permutation: at(line, put(hints.permutation[line]))(task.permutation)};
         } else if (query.type === 'perm-cipher') {
            const line = hints.permutation.indexOf(query.line);
            newTask = {...task, permutation: at(line, put(hints.permutation[line]))(task.permutation)};
         } else {
            return callback('error');
         }
         // self.props.dispatch({type: 'SET_TASK', task: newTask});
         callback();
      }, 200);
   };
*/

export function run (container) {
   const store = createStore(reducer);
   store.dispatch({type: 'Task.Init', task: initialTask});
   ReactDOM.render(<Provider store={store}><Demo/></Provider>, container);
};
