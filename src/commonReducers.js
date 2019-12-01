import { combineReducers } from "redux";

import * as TimeCounterActions from "./components/TimeCounter/timeCounterConstants";
import * as ActionTypes from "./commonConstants";
import { asyncStateReducer } from "./utils/reduxUtils";

const asyncSprintListReducer = asyncStateReducer({
  [ActionTypes.FETCH_SPRINTS_REQUEST]: "pending",
  [ActionTypes.FETCH_SPRINTS_FAILURE]: "error",
  [ActionTypes.FETCH_SPRINTS_SUCCESS]: "complete",
});

const asyncSprintIssuesReducer = asyncStateReducer({
  [ActionTypes.FETCH_SPRINT_ISSUES_REQUEST]: "pending",
  [ActionTypes.FETCH_SPRINT_ISSUES_FAILURE]: "error",
  [ActionTypes.FETCH_SPRINT_ISSUES_SUCCESS]: "complete",
});

const asyncSprintReducer = asyncStateReducer({
  [ActionTypes.FETCH_SPRINT_REQUEST]: "pending",
  [ActionTypes.FETCH_SPRINT_FAILURE]: "error",
  [ActionTypes.FETCH_SPRINT_SUCCESS]: "complete",
});

const asyncProjectReducer = asyncStateReducer({
  [ActionTypes.FETCH_PROJECTS_REQUEST]: "pending",
  [ActionTypes.FETCH_PROJECTS_FAILURE]: "error",
  [ActionTypes.FETCH_PROJECTS_SUCCESS]: "complete",
});

const asyncSettingReducer = asyncStateReducer({
  [ActionTypes.FETCH_SETTINGS_REQUEST]: "pending",
  [ActionTypes.FETCH_SETTINGS_FAILURE]: "error",
  [ActionTypes.FETCH_SETTINGS_SUCCESS]: "complete",
});

const asyncJotsReducer = asyncStateReducer({
  [ActionTypes.FETCH_JOTS_REQUEST]: "pending",
  [ActionTypes.FETCH_JOTS_FAILURE]: "error",
  [ActionTypes.FETCH_JOTS_SUCCESS]: "complete",
});

const sprintListReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_SPRINT_SUCCESS:
      return {
        ...state,
        data: [...state.data, action.responseJson],
      };
    default:
      return asyncSprintListReducer(state, action);
  }
};

const projectListReducer = (state, action) => {
  switch (action.type) {
    default:
      return asyncProjectReducer(state, action);
  }
};

const issueListReducer = (state, action) => {
  switch (action.type) {
    case TimeCounterActions.UPDATE_TIME_SUCCESS:
      return {
        ...state,
        data: state.data.map(
          issue =>
            issue.id === action.responseJson.id ? action.responseJson : issue
        ),
      };
    case ActionTypes.CREATE_ISSUE_SUCCESS:
      return {
        ...state,
        data: [...state.data, action.responseJson],
      };
    default:
      return asyncSprintIssuesReducer(state, action);
  }
};

const settingReducer = (state, action) => {
  switch (action.type) {
    default:
      return asyncSettingReducer(state, action);
  }
};

const jotsReducer = (state, action) => {
  switch (action.type) {
    default:
      return asyncJotsReducer(state, action);
  }
};

export default combineReducers({
  sprintList: sprintListReducer,
  sprintIssues: issueListReducer,
  sprint: asyncSprintReducer,
  settings: settingReducer,
  projects: projectListReducer,
  jots: jotsReducer,
});
