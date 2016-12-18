
import {WorkspaceManager} from 'alkindi-task-lib';
import {setupTools, makeRootScope} from './tools/index';

export default function (state, action) {
   switch (action.type) {
   case '@@redux/INIT':
      return {};
   case 'Task.Init': {
         const {task} = action;
         return {
            ...state,
            task,
            workspace: WorkspaceManager.init(setupTools),
            rootScope: makeRootScope(task),
            unsavedChanges: false
         };
      }
   case 'Task.Load':
      return {
         ...state,
         workspace: WorkspaceManager.load(state.workspace, action.dump),
         unsavedChanges: false
      };
   case 'Task.Changed':
      return {
         ...state,
         unsavedChanges: true
      };
   case 'Task.Saved':
      return {
         ...state,
         unsavedChanges: false
      };
      // XXX update rootScope when a hint is received (task changes)
   }
   // Forward Task.Tool.-prefixed actions to the workspace.
   if (/^Task\.Tool\./.test(action.type)) {
      const workspace = WorkspaceManager.taskToolReducer(state.workspace, action)
      return {...state, workspace, unsavedChanges: true};
   }
   return state;
};
