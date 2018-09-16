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

const asyncScratchpadReducer = asyncStateReducer({
  [ActionTypes.FETCH_SCRATCHPADS_REQUEST]: "pending",
  [ActionTypes.FETCH_SCRATCHPADS_FAILURE]: "error",
  [ActionTypes.FETCH_SCRATCHPADS_SUCCESS]: "complete",
});

const asyncPageReducer = asyncStateReducer({
  [ActionTypes.FETCH_PAGES_REQUEST]: "pending",
  [ActionTypes.FETCH_PAGES_FAILURE]: "error",
  [ActionTypes.FETCH_PAGES_SUCCESS]: "complete",
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
        data: state.data.filter(log => log.id !== action.responseJson),
      };
    default:
      return asyncTimeRemainingLogListReducer(state, action);
  }
};

const pageReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_PAGE_SUCCESS:
      return {
        ...state,
        data: [...state.data, action.responseJson],
      };
    case ActionTypes.ARCHIVE_PAGE_SUCCESS:
      return {
        ...state,
        data: state.data.filter(page => page.id !== action.responseJson),
      };
    default:
      return asyncPageReducer(state, action);
  }
};

const scratchpadReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_SCRATCHPADS_SUCCESS:
      return {
        ...state,
        data: [...state.data, action.responseJson],
      };
    case ActionTypes.ARCHIVE_SCRATCHPAD_SUCCESS:
      return {
        ...state,
        data: state.data.filter(
          scratchpad => scratchpad.id !== action.responseJson.id
        ),
      };
    case ActionTypes.SET_SCRATCHPAD_SUCCESS:
      return {
        ...state,
        data: state.data.map(
          scratchpad =>
            scratchpad.id === action.responseJson.id
              ? action.responseJson
              : scratchpad
        ),
      };
    case ActionTypes.ARCHIVE_PAGE_SUCCESS:
      return {
        ...state,
        data: state.data.filter(
          scratchpad => scratchpad.page !== action.responseJson
        ),
      };
    case ActionTypes.FETCH_ARCHIVED_SCRATCHPADS_SUCCESS:
      return {
        ...state,
        data: action.responseJson,
      };
    default:
      return asyncScratchpadReducer(state, action);
  }
};

export default combineReducers({
  timeSpentLogList: timeSpentLogReducer,
  timeRemainingLogList: timeRemainingLogReducer,
  scratchpads: scratchpadReducer,
  pages: pageReducer,
});
