import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import "react-datepicker/dist/react-datepicker.css";

import "./semantic/dist/semantic.min.css";
import "./App.css";

import SprintPage from "./screens/SprintPage/SprintPage";
import IssuePage from "./screens/IssuePage/IssuePage";
import SideBar from "./components/SideBar/SideBar";

import * as CommonActions from "./commonActions";

class App extends Component {
  state = {};

  componentDidMount() {
    this.props.getSettings();
    this.props.getProjects();
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Grid columns={2} divided>
            <Grid.Row>
              <SideBar />

              <Grid.Column width={13}>
                <Route
                  exact
                  path="/sprint/:id?"
                  render={props => {
                    return <SprintPage {...props} />;
                  }}
                />

                <Route
                  exact
                  path="/issue/:id?"
                  render={props => {
                    console.log(props);
                    return <IssuePage {...props} />;
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  getSettings: CommonActions.getSettings,
  getProjects: CommonActions.getProjects,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
