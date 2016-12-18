
import {WorkspaceManager} from 'alkindi-task-lib';

/* Selector returning whether the task's state has unsaved changes. */
export function hasUnsavedChanges (state) {
   return state.unsavedChanges;
};

/* Selector returning a dump of the task's state (to be passed as the 'load'
   property of a 'Load' task action). */
export function dump (state) {
   return WorkspaceManager.dump(state.workspace);
};
