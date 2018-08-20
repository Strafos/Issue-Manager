import { combineReducers } from "redux";

import * as ActionTypes from "./sprintPageConstants";
import { asyncStateReducer } from "../../utils/reduxUtils";

const asyncTimelogListReducer = asyncStateReducer({
  [ActionTypes.FETCH_TIMELOGS_REQUEST]: "pending",
  [ActionTypes.FETCH_TIMELOGS_FAILURE]: "error",
  [ActionTypes.FETCH_TIMELOGS_SUCCESS]: "complete",
});

const timelogListReducer = (state, action) => {
  switch (action.type) {
    default:
      return asyncTimelogListReducer(state, action);
  }
};

export default combineReducers({
  timelogList: timelogListReducer,
});
