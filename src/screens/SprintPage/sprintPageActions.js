import { asyncActionCreator } from "../../utils/reduxUtils";

import * as ActionTypes from "./sprintPageConstants";

import * as API from "../../utils/api";

export const getTimeSpentLogs = sprintId =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_SPENT_TIMELOGS_REQUEST,
      complete: ActionTypes.FETCH_SPENT_TIMELOGS_SUCCESS,
      error: ActionTypes.FETCH_SPENT_TIMELOGS_FAILURE,
    },
    API.getTimeSpentLogs
  )(sprintId);

export const getTimeRemainingLogs = sprintId =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_REMAINING_TIMELOGS_REQUEST,
      complete: ActionTypes.FETCH_REMAINING_TIMELOGS_SUCCESS,
      error: ActionTypes.FETCH_REMAINING_TIMELOGS_FAILURE,
    },
    API.getTimeRemainingLogs
  )(sprintId);

export const deleteLog = id =>
  asyncActionCreator(
    {
      pending: ActionTypes.DELETE_TIMELOGS_REQUEST,
      complete: ActionTypes.DELETE_TIMELOGS_SUCCESS,
      error: ActionTypes.DELETE_TIMELOGS_FAILURE,
    },
    API.deleteTimeLog
  )(id);
