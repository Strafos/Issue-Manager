import { asyncActionCreator } from "./utils/reduxUtils";

import * as ActionTypes from "./commonConstants";

import * as API from "./utils/api";

export const getAllSprints = () =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_SPRINTS_REQUEST,
      complete: ActionTypes.FETCH_SPRINTS_SUCCESS,
      error: ActionTypes.FETCH_SPRINTS_FAILURE,
    },
    API.getSprints
  )();
