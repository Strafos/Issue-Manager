import { combineReducers } from "redux";

import notePage from "./screens/NotePage/notePageReducer";
import dashboardPage from "./screens/DashboardPage/dashboardPageReducer";
import commonData from "./commonReducers";

export default combineReducers({
  notePage,
  dashboardPage,
  // commonData,
});
