import algoreaReactTask from "./algorea_react_task";
import update from "immutability-helper";

import "font-awesome/css/font-awesome.css";
import "bootstrap/dist/css/bootstrap.css";
import "rc-tooltip/assets/bootstrap.css";
import "./platform.css";
import "./style.css";

import {clearAlphabet, adfgxAlphabet, bigramAlphabet, clipGrid} from './utils';
import WorkspaceBundle from "./workspace_bundle";

const TaskBundle = {
  actionReducers: {
    appInit: appInitReducer,
    taskInit: taskInitReducer,
    taskRefresh: taskRefreshReducer,
    taskAnswerLoaded: taskAnswerLoaded,
    taskStateLoaded: taskStateLoaded
  },
  includes: [WorkspaceBundle],
  selectors: {
    getTaskState,
    getTaskAnswer
  }
};

if (process.env.NODE_ENV === "development") {
  /* eslint-disable no-console */
  TaskBundle.earlyReducer = function (state, action) {
    console.log("ACTION", action.type, action);
    return state;
  };
}

export function run (container, options) {
  return algoreaReactTask(container, options, TaskBundle);
}

function appInitReducer (state, _action) {
  const taskMetaData = {
    id: "http://concours-alkindi.fr/tasks/2016/adfx",
    language: "fr",
    version: "fr.01",
    authors: "Sébastien Carlier",
    translators: [],
    license: "",
    taskPathPrefix: "",
    modulesPathPrefix: "",
    browserSupport: [],
    fullFeedback: true,
    acceptedAnswers: [],
    usesRandomSeed: true
  };
  return {...state, taskMetaData};
}

function taskInitReducer (state, _action) {
  const {taskData} = state;

  return {
    ...state,
    taskReady: true,
    clearAlphabet,
    adfgxAlphabet,
    bigramAlphabet,
    cipheredText: taskData.cipher_text,
    substitutionGridHints: clipGrid(taskData.substitution_grid),
    permutationHints: taskData.permutation,
  };
}

function taskRefreshReducer (state, _action) {
  // All the work is done in the late reducers.
  const {taskData} = state;
  return {
    ...state,
    substitutionGridHints: clipGrid(taskData.substitution_grid),
    permutationHints: taskData.permutation
  };
}

function getTaskAnswer (state) {
  return {
    clearText: state.applySubstitution.outputText,
    editedPairs: state.frequencyAnalysis.editedPairs,
  };
}

function taskAnswerLoaded (state, {payload: {answer: dump}}) {
  return update(state, {
    frequencyAnalysis: {editedPairs: {$set: dump.editedPairs}}
  });
}

function getTaskState (state) {
  return {
    // not saved: state.bigramFrequencyAnalysis.substitutionEdits
  };
}

function taskStateLoaded (state, {payload: {dump}}) {
  return state;
}
