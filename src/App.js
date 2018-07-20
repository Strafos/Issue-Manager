import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import {
  Message,
  Icon,
  Divider,
  Header,
  Button,
  Grid
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";

import "./semantic/dist/semantic.min.css";

import SprintModal from "./components/SprintModal/SprintModal";
import SprintDropDown from "./components/SprintDropDown/SprintDropDown";
import RecentMenu from "./components/RecentMenu/RecentMenu";
import IssueModal from "./components/IssueModal/IssueModal";
import SprintDisplay from "./components/SprintDisplay/SprintDisplay";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import IssueDisplay from "./components/IssueDisplay/IssueDisplay";
import SprintGraphPage from "./components/SprintGraphPage/SprintGraphPage";

import { getSprints, getProjects, getRecentIssues } from "./utils/api/api";

class App extends Component {
  state = {
    sprints: [],
    projects: [],
    selectedSprint: null,
    defaultSprint: null,
    recentIssues: null,
    errorMessage: "",
    showErrorMessage: false
  };

  handleSprintIndex = index => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id == index)
    });
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id === value)
    });
  };

  handleSprintMenuClick = (event, { index }) => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id === index)
    });
  };

  handleIssueMenuClick = (event, { index }) => {
    this.setState({
      selectedIssue: index
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
      errorMessage: message
    });
  };

  componentDidMount() {
    getRecentIssues().then(issues => {
      this.setState({
        recentIssues: issues
      });
    });
    getProjects().then(projects => {
      this.setState({ projects });
    });
    getSprints().then(sprints => {
      this.setState({ sprints });
      const path = window.location.pathname;
      const pathRe = /\/(.*)\/(.*)/g;
      const match = pathRe.exec(path);
      if (match && match[1] === "sprint") {
        this.setState({
          selectedSprint: match
            ? sprints.find(sprint => sprint.id == match[2])
            : this.getDefaultSprint(sprints)
        });
      } else if (match && match[1] === "issue") {
        this.setState({
          selectedIssue: match[2]
        });
      } else {
        this.setState({
          selectedSprint: this.getDefaultSprint(sprints)
        });
      }
    });
  }

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

  updateNotes = notes => {
    const { selectedSprint } = this.state;
    selectedSprint.notes = notes;
    this.setState({
      selectedSprint
    });
  };

  updateComponent = () => {
    this.forceUpdate();
  };

  renderSprintDisplay = () => {
    const { projects, selectedSprint } = this.state;

    return (
      <SprintDisplay
        projects={projects}
        selectedSprint={selectedSprint}
        sprintId={selectedSprint && selectedSprint.id}
        update={this.updateNotes}
      />
    );
  };

  render() {
    const {
      sprints,
      projects,
      selectedSprint,
      recentIssues,
      selectedIssue
    } = this.state;

    return (
      <Router>
        <div className="App">
          <Header size="huge" as="h1">
            <a href={"/"}>
              <Icon color="red" name="paper plane" />
            </a>
            Zaibo's Issue Manager
          </Header>
          <Divider />
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
                    <RecentMenu
                      selectedSprint={selectedSprint}
                      selectedIssue={selectedIssue}
                      handleSprintMenuClick={this.handleSprintMenuClick}
                      handleIssueMenuClick={this.handleIssueMenuClick}
                      sprints={sprints}
                      recentIssues={recentIssues}
                    />
                  </div>
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
                <Route
                  exact
                  path="/"
                  render={props => {
                    return (
                      <SprintDisplay
                        projects={projects}
                        update={this.updateNotes}
                        sprints={sprints}
                        error={this.setError}
                        {...props}
                      />
                    );
                  }}
                />
                <Route
                  exact
                  path="/sprint/:id?"
                  render={props => {
                    return (
                      <SprintDisplay
                        projects={projects}
                        update={this.updateNotes}
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
                      <IssueDisplay
                        projects={projects}
                        error={this.setError}
                        sprints={sprints}
                        {...props}
                      />
                    );
                  }}
                />
                <Route
                  path="/sprint/graph/:id?"
                  render={props => {
                    return (
                      sprints.length > 0 && (
                        <SprintGraphPage
                          projects={projects}
                          error={this.setError}
                          sprints={sprints}
                          {...props}
                        />
                      )
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
