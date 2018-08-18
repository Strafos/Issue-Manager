export const asyncActionCreator = (asyncTypes, asyncFn) => {
  const factory = (...args) => async dispatch => {
    dispatch({ type: asyncTypes.pending });

    try {
      const responseJson = await asyncFn(...args);
      dispatch({
        type: asyncTypes.complete,
        responseJson,
      });
    } catch (errorObj) {
      dispatch({
        type: asyncTypes.error,
        msg: errorObj.message,
        errorObj,
      });
    }
  };
  return factory;
};

export const asyncInitialState = { loading: false, data: null, error: null };

export const asyncStateReducer = asyncStates => (
  state = asyncInitialState,
  action
) => {
  const asyncState = asyncStates[action.type];
  switch (asyncState) {
    case "pending":
      return {
        ...state,
        loading: true,
      };
    case "error":
      return {
        ...state,
        loading: false,
        error: { msg: action.msg, obj: action.errorObj },
      };
    case "complete":
      return {
        ...state,
        loading: false,
        data: action.responseJson,
      };
    case "reset":
      return asyncInitialState;
    default:
      return state;
  }
};
