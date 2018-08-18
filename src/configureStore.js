import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./rootReducer";

const middlewares = [thunk];

let composeEnhancers = compose;
if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = initState => {
  const store = createStore(
    rootReducer,
    initState,
    composeEnhancers(applyMiddleware(...middlewares))
  );
  return store;
};

export default configureStore;
