import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { Message, Header, Divider, Button, Grid } from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";

import "./semantic/dist/semantic.min.css";

import IssueModal from "./components/Modal/IssueModal/IssueModal";
import ProjectModal from "./components/Modal/ProjectModal/ProjectModal";
import SprintModal from "./components/Modal/SprintModal/SprintModal";

import SprintDropDown from "./components/SprintDropDown/SprintDropDown";
import SprintMenu from "./components/SprintMenu/SprintMenu";
import TodoList from "./components/TodoList/TodoList";
import SprintPage from "./screens/SprintPage/SprintPage";
import IssuePage from "./screens/IssuePage/IssuePage";
import TimeSpentMiniGraph from "./screens/SprintPage/GraphDisplay/Graphs/TimeSpentMiniGraph";

import { getSprints, getProjects, getRecentIssues } from "./utils/api";

class App extends Component {
  state = {
    sprints: [],
    projects: [],
    selectedSprint: null,
    defaultSprint: null,
    errorMessage: "",
    showErrorMessage: false,
  };

  handleSprintIndex = index => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id == index),
    });
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id === value),
    });
  };

  handleSprintMenuClick = (event, { index }) => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id === index),
    });
  };

  handleErrorMessage = () => {
    return (
      <Message negative>
        <Message.Header>{this.state.errorMessage}</Message.Header>
      </Message>
    );
  };

  setError = message => {
    this.setState({
      showErrorMessage: true,
      errorMessage: message,
    });
  };

  componentDidMount() {
    getProjects().then(projects => {
      this.setState({ projects });
    });

    getSprints().then(sprints => {
      this.setState({ sprints });
      const path = window.location.pathname;
      const pathRe = /\/(.*)\/(.*)/g;
      const match = pathRe.exec(path);

      // } else (match && match[1] === "sprint") {
      // If sprint is in the URL, then set selectedSprint
      this.setState({
        selectedSprint: match
          ? sprints.find(sprint => sprint.id == match[2])
          : this.getDefaultSprint(sprints),
      });
    });
  }

  // Calculate default sprint by getting the last Monday (unless today is Monday)
  getDefaultSprint = sprints => {
    const d = new Date();
    if (d.getDay() !== 1) {
      // Get last monday unless today is Monday
      d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) - 7);
    }

    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    const lastMonday = d.toLocaleDateString("en-US", options);
    return sprints.find(sprint => sprint.start_date === lastMonday);
  };

  updateComponent = () => {
    this.forceUpdate();
  };

  render() {
    const { sprints, projects, selectedSprint } = this.state;

    return (
      <Router>
        <div className="App">
          <Grid columns={2} divided>
            <Grid.Row />
            <Grid.Row>
              <Grid.Column width={3}>
                <Grid.Row>
                  <br />
                  <Button.Group color="black" vertical>
                    <SprintModal sprints={sprints} />
                    <ProjectModal sprints={sprints} projects={projects} />
                    <IssueModal
                      projects={projects}
                      sprints={sprints}
                      selectedSprint={selectedSprint}
                      update={this.updateComponent}
                    />
                  </Button.Group>
                </Grid.Row>
                <br />

                <Grid.Row>
                  <div className="center">
                    <SprintMenu
                      handleSprintMenuClick={this.handleSprintMenuClick}
                      handleIssueMenuClick={this.handleIssueMenuClick}
                      sprints={sprints}
                    />
                    <br />
                    <TodoList />
                  </div>

                  {selectedSprint && (
                    <div>
                      <br />
                      <TimeSpentMiniGraph sprint={selectedSprint} />
                    </div>
                  )}
                </Grid.Row>

                <br />
                <Grid.Row>
                  <SprintDropDown
                    sprints={sprints}
                    onChange={this.handleSprintSelect}
                    simple={true}
                  />
                </Grid.Row>
              </Grid.Column>

              <Grid.Column width={13}>
                {this.state.showErrorMessage && this.handleErrorMessage()}
                {/* <Route
                  exact
                  path="/"
                  render={props => {
                    return (
                      <SprintPage
                        projects={projects}
                        sprints={sprints}
                        error={this.setError}
                        {...props}
                      />
                    );
                  }}
                /> */}

                <Route
                  exact
                  path="/sprint/:id?"
                  render={props => {
                    return (
                      <SprintPage
                        projects={projects}
                        error={this.setError}
                        sprints={sprints}
                        {...props}
                      />
                    );
                  }}
                />

                <Route
                  path="/issue/:id?"
                  render={props => {
                    return (
                      <IssuePage
                        projects={projects}
                        error={this.setError}
                        sprints={sprints}
                        {...props}
                      />
                    );
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

export default App;
