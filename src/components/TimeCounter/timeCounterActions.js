import { asyncActionCreator } from "../../utils/reduxUtils";

import * as ActionTypes from "./timeCounterConstants";

import * as API from "../../utils/api";

export const setTime = (issueId, stat, newTime) =>
  asyncActionCreator(
    {
      pending: ActionTypes.UPDATE_TIME_REQUEST,
      complete: ActionTypes.UPDATE_TIME_SUCCESS,
      error: ActionTypes.UPDATE_TIME_FAILURE,
    },
    API.setTime
  )(issueId, stat, newTime);
