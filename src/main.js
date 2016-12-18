
import React from 'react';
import ReactDOM from 'react-dom';
import {Alert, Button} from 'react-bootstrap';
import {createStore} from 'redux';
import {Provider, connect} from 'react-redux';
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import {WorkspaceManager} from 'alkindi-task-lib';
import EpicComponent from 'epic-component';

import reducer from './reducer';
import {Task} from './views';

import 'normalize.css';
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'rc-tooltip/assets/bootstrap.css';
import './platform.css';
import './style.css';

const AppSelector = function (state) {
   const {score, task, workspace, unsavedChanges, rootScope} = state;
   return {score, task, workspace, unsavedChanges, rootScope};
};

const App = EpicComponent(self => {

   self.render = function () {
      console.log(self.props);
      const {task, rootScope, workspace, unsavedChanges, dispatch} = self.props;
      if (!task) {
         return <p>Task is not loaded.</p>;
      }
      return <Task task={task}/>;
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

const WrappedApp = DragDropContext(HTML5Backend)(connect(AppSelector)(App));

export function run (container, initialTask) {
   console.log('reducer', reducer);
   const store = createStore(reducer);
   store.dispatch({type: 'Task.Init', task: initialTask});
   ReactDOM.render(<Provider store={store}><WrappedApp/></Provider>, container);
};
