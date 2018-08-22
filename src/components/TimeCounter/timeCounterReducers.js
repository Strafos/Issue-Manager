import { combineReducers } from "redux";

import * as ActionTypes from "./timeCounterConstants";
import { asyncStateReducer } from "../../utils/reduxUtils";

const asyncTimeReducer = asyncStateReducer({
  [ActionTypes.UPDATE_TIME_REQUEST]: "pending",
  [ActionTypes.UPDATE_TIME_FAILURE]: "error",
  [ActionTypes.UPDATE_TIME_SUCCESS]: "complete",
});

// DOn't think I need a reducer?
export default combineReducers({
  timeCounterReducer: asyncTimeReducer,
});
