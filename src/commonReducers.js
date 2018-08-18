import { combineReducers } from "redux";

import * as ActionTypes from "./commonConstants";
import { asyncStateReducer } from "./utils/reduxUtils";

const asyncSprintReducer = asyncStateReducer({
  [ActionTypes.FETCH_SPRINTS_REQUEST]: "pending",
  [ActionTypes.FETCH_SPRINTS_FAILURE]: "error",
  [ActionTypes.FETCH_SPRINTS_SUCCESS]: "complete",
});

const asyncSprintIssuesReducer = asyncStateReducer({
  [ActionTypes.FETCH_SPRINT_ISSUES_REQUEST]: "pending",
  [ActionTypes.FETCH_SPRINT_ISSUES_FAILURE]: "error",
  [ActionTypes.FETCH_SPRINT_ISSUES_SUCCESS]: "complete",
});

const sprintListReducer = (state, action) => {
  switch (action.type) {
    default:
      return asyncSprintReducer(state, action);
  }
};

export default combineReducers({
  sprintList: sprintListReducer,
  sprintIssues: asyncSprintIssuesReducer,
});