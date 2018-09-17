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

export const getAllScratchpads = () =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_ALL_SCRATCHPADS_REQUEST,
      complete: ActionTypes.FETCH_ALL_SCRATCHPADS_SUCCESS,
      error: ActionTypes.FETCH_ALL_SCRATCHPADS_FAILURE,
    },
    API.getAllScratchpads
  )();

export const getScratchpads = page =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_SCRATCHPADS_REQUEST,
      complete: ActionTypes.FETCH_SCRATCHPADS_SUCCESS,
      error: ActionTypes.FETCH_SCRATCHPADS_FAILURE,
    },
    API.getScratchpads
  )(page);

export const getArchivedScratchpads = () =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_ARCHIVED_SCRATCHPADS_REQUEST,
      complete: ActionTypes.FETCH_ARCHIVED_SCRATCHPADS_SUCCESS,
      error: ActionTypes.FETCH_ARCHIVED_SCRATCHPADS_FAILURE,
    },
    API.getArchivedScratchpads
  )();

export const setScratchpad = (id, content) =>
  asyncActionCreator(
    {
      pending: ActionTypes.SET_SCRATCHPAD_REQUEST,
      complete: ActionTypes.SET_SCRATCHPAD_SUCCESS,
      error: ActionTypes.SET_SCRATCHPAD_FAILURE,
    },
    API.setScratchpad
  )(id, content);

export const archiveScratchpad = (id, content, title, archived) =>
  asyncActionCreator(
    {
      pending: ActionTypes.ARCHIVE_SCRATCHPAD_REQUEST,
      complete: ActionTypes.ARCHIVE_SCRATCHPAD_SUCCESS,
      error: ActionTypes.ARCHIVE_SCRATCHPAD_FAILURE,
    },
    API.archiveScratchpad
  )(id, content, title, archived);

export const createScratchpad = pageId =>
  asyncActionCreator(
    {
      pending: ActionTypes.CREATE_SCRATCHPADS_REQUEST,
      complete: ActionTypes.CREATE_SCRATCHPADS_SUCCESS,
      error: ActionTypes.CREATE_SCRATCHPADS_FAILURE,
    },
    API.createScratchpad
  )(pageId);

export const createPage = name =>
  asyncActionCreator(
    {
      pending: ActionTypes.CREATE_PAGE_REQUEST,
      complete: ActionTypes.CREATE_PAGE_SUCCESS,
      error: ActionTypes.CREATE_PAGE_FAILURE,
    },
    API.createPage
  )(name);

export const getPages = name =>
  asyncActionCreator(
    {
      pending: ActionTypes.FETCH_PAGES_REQUEST,
      complete: ActionTypes.FETCH_PAGES_SUCCESS,
      error: ActionTypes.FETCH_PAGES_FAILURE,
    },
    API.getPages
  )();

export const archivePage = (pageId, archived) =>
  asyncActionCreator(
    {
      pending: ActionTypes.ARCHIVE_PAGE_REQUEST,
      complete: ActionTypes.ARCHIVE_PAGE_SUCCESS,
      error: ActionTypes.ARCHIVE_PAGE_FAILURE,
    },
    API.archivePage
  )(pageId, archived);
