import { asyncActionCreator } from "../../utils/reduxUtils";

import * as ActionTypes from "./sprintPageConstants";

import * as API from "../../utils/api";

export const getTimeLogs = sprintId =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_TIMELOGS_REQUEST,
      complete: ActionTypes.FETCH_TIMELOGS_SUCCESS,
      error: ActionTypes.FETCH_TIMELOGS_FAILURE,
    },
    API.getTimeLogs
  )(sprintId);
