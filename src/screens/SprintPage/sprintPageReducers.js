import { combineReducers } from "redux";

import * as ActionTypes from "./sprintPageConstants";
import { asyncStateReducer } from "../../utils/reduxUtils";

const asyncTimeSpentLogListReducer = asyncStateReducer({
  [ActionTypes.FETCH_SPENT_TIMELOGS_REQUEST]: "pending",
  [ActionTypes.FETCH_SPENT_TIMELOGS_FAILURE]: "error",
  [ActionTypes.FETCH_SPENT_TIMELOGS_SUCCESS]: "complete",
});

const asyncTimeRemainingLogListReducer = asyncStateReducer({
  [ActionTypes.FETCH_REMAINING_TIMELOGS_REQUEST]: "pending",
  [ActionTypes.FETCH_REMAINING_TIMELOGS_FAILURE]: "error",
  [ActionTypes.FETCH_REMAINING_TIMELOGS_SUCCESS]: "complete",
});

const timeSpentLogReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.DELETE_TIMELOGS_SUCCESS:
      return {
        ...state,
        data: state.data.filter(log => log.id !== action.responseJson),
      };
    default:
      return asyncTimeSpentLogListReducer(state, action);
  }
};

const timeRemainingLogReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.DELETE_TIMELOGS_SUCCESS:
      return {
        ...state,
        data: state.data.filter(log => log.id !== action.responseJson.id),
      };
    default:
      return asyncTimeRemainingLogListReducer(state, action);
  }
};

export default combineReducers({
  timeSpentLogList: timeSpentLogReducer,
  timeRemainingLogList: timeRemainingLogReducer,
});
