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
    API.getSprintIssues
  )(sprintId);

export const getSprint = sprintId =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_SPRINT_REQUEST,
      complete: ActionTypes.FETCH_SPRINT_SUCCESS,
      error: ActionTypes.FETCH_SPRINT_FAILURE,
    },
    API.getSprint
  )(sprintId);

export const createIssue = requestObj =>
  asyncActionCreator(
    {
      pending: ActionTypes.CREATE_ISSUE_REQUEST,
      complete: ActionTypes.CREATE_ISSUE_SUCCESS,
      error: ActionTypes.CREATE_ISSUE_FAILURE,
    },
    API.createIssue
  )(requestObj);

export const createSprint = requestObj =>
  asyncActionCreator(
    {
      pending: ActionTypes.CREATE_SPRINT_REQUEST,
      complete: ActionTypes.CREATE_SPRINT_SUCCESS,
      error: ActionTypes.CREATE_SPRINT_FAILURE,
    },
    API.createSprint
  )(requestObj);

export const getSettings = () =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_SETTINGS_REQUEST,
      complete: ActionTypes.FETCH_SETTINGS_SUCCESS,
      error: ActionTypes.FETCH_SETTINGS_FAILURE,
    },
    API.getSettings
  )();

export const getJots = () =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_JOTS_REQUEST,
      complete: ActionTypes.FETCH_JOTS_SUCCESS,
      error: ActionTypes.FETCH_JOTS_FAILURE,
    },
    API.getJots
  )();

export const updateJots = requestObj =>
  asyncActionCreator(
    {
      pending: ActionTypes.UPDATE_JOTS_REQUEST,
      complete: ActionTypes.UPDATE_JOTS_SUCCESS,
      error: ActionTypes.UPDATE_JOTS_FAILURE,
    },
    API.updateJots
  )(requestObj);

export const getProjects = () =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_PROJECTS_REQUEST,
      complete: ActionTypes.FETCH_PROJECTS_SUCCESS,
      error: ActionTypes.FETCH_PROJECTS_FAILURE,
    },
    API.getProjects
  )();
