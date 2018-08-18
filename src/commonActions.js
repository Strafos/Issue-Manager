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

export const getSprintIssues = sprintId =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_SPRINT_ISSUES_REQUEST,
      complete: ActionTypes.FETCH_SPRINT_ISSUES_SUCCESS,
      error: ActionTypes.FETCH_SPRINT_ISSUES_FAILURE,
    },
    API.getSprint
  )(sprintId);
