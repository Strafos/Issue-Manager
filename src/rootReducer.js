import { combineReducers } from "redux";

// import notePage from "./screens/NotePage/notePageReducer";
import sprintPage from "./screens/SprintPage/sprintPageReducers";
import commonData from "./commonReducers";

export default combineReducers({
  // notePage,
  // dashboardPage,
  sprintPage,
  commonData,
});
