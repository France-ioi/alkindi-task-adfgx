
import React from 'react';
import EpicComponent from 'epic-component';

/* Returns a workspace initialized by setupTools, which is passed an addTool
   function which takes a Tool factory, a wiring function, and the tool's
   initial state, and returns the tool's index. */
export const init = function (setupTools) {
  const tools = [];
  const workspace = {tools};
  const addTool = function (factory, wire, initialState) {
    const index = tools.length;
    const tool = {
      index,
      wire,
      state: {},
      reducers: {},
      dump: state => state,
      load: dump => dump
    };
    factory(tool);
    let state = tool.load(initialState);
    tool.state = tool.initialState = state;
    tools.push(tool);
    return index;
  };
  setupTools(addTool);
  return workspace;
};

/* Returns a dump of the tool states that can be stored and passed to load. */
export const dump = function (workspace) {
  return workspace.tools.map(function (tool) {
    return {state: tool.dump(tool.state)};
  });
};

/* Loads a dump into a workspace. */
export const load = function (workspace, dump) {
  const tools = workspace.tools.map(function (tool, i) {
    return {...tool, state: tool.load(dump[i].state)};
  });
  return {...workspace, tools};
};

/* Apply a task tool action (type prefixed with 'Task.Tool.'). */
export const taskToolReducer = function (workspace, action) {
  const {tools} = workspace;
  const {toolIndex, type} = action;
  const typeMatch = /^Task\.Tool\.(.*)$/.exec(action.type);
  if (typeof toolIndex !== 'number' || !typeMatch) {
    return workspace;
  }
  const tool = tools[toolIndex];
  if (!tool) {
    return workspace;
  }
  const reducer = tool.reducers[typeMatch[1]];
  if (!reducer || typeof reducer !== 'function') {
    return workspace;
  }
  const newTools = tools.slice();
  newTools[toolIndex] = {...tool, state: reducer(tool.state, action)};
  return {...workspace, tools: newTools};
};

/* Workspace view props: rootScope, workspace, dispatch */
export const View = EpicComponent(self => {

  // When a tool calls its dispatch prop with an action, the action's type is
  // prefixed with 'Task.Tool.' and the tool's index is added as 'toolIndex'.
  const toolDispatch = function (action) {
    self.props.dispatch({
      ...action,
      type: "Task.Tool." + action.type,
      toolIndex: this.index
    });
  };

  // Maintain a cache of dispatch functions bound to each tool.
  let dispatchCache = new WeakMap();
  const getToolDispatch = function (tool) {
    let dispatch;
    if (dispatchCache.has(tool)) {
      dispatch = dispatchCache.get(tool);
    } else {
      dispatch = toolDispatch.bind(tool);
      dispatchCache.set(tool, dispatch);
    }
    return dispatch;
  };

  self.componentWillReceiveProps = function (nextProps) {
    // Clear the cache if the dispatch function changes.
    if (nextProps.dispatch !== self.props.dispatch) {
      dispatchCache = new WeakMap();
    }
  };

  self.render = function () {
    const {rootScope, workspace, dispatch} = self.props;
    const scopes = [];
    const renderTool = function (tool) {
      const {index, wire, compute, Component, state} = tool;
      const scope = Object.create(rootScope);
      const dispatch = getToolDispatch(tool);
      wire(scopes, scope);
      scopes.push(scope);
      compute(state, scope);
      return <Component key={index} state={state} scope={scope} dispatch={dispatch}/>;
    };
    return <div>{workspace.tools.map(renderTool)}</div>;
  };

});
