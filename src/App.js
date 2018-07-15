import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Icon, Header, Button, Grid } from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";

import "./semantic/dist/semantic.min.css";

import SprintModal from "./components/SprintModal/SprintModal";
import SprintDropDown from "./components/SprintDropDown/SprintDropDown";
import RecentMenu from "./components/RecentMenu/RecentMenu";
import IssueModal from "./components/IssueModal/IssueModal";
import IssueTable from "./components/IssueTable/IssueTable";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import IssueDisplay from "./components/IssueDisplay/IssueDisplay";

import { getSprints, getProjects, getRecentIssues } from "./utils/api/api";

class App extends Component {
  state = {
    sprints: [],
    projects: [],
    selectedSprint: null,
    defaultSprint: null,
    recentIssues: null
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
      }
    });
  }

  getDefaultSprint = sprints => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) - 7); // Current Monday

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

  renderIssueTable = () => {
    const { projects, selectedSprint } = this.state;

    return (
      <IssueTable
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
          <div className="foo" alternative>
            <Header size="huge" as="h1">
              <a href={"/"}>
                <Icon name="trash alternate outline" />
              </a>
              Zaibo's Issue Manager
            </Header>
          </div>
          <Grid columns={2} divided>
            <Grid.Row />
            <Grid.Row>
              <Grid.Column width={3}>
                <Grid.Row>
                  <br />
                  <Button.Group color="green" vertical>
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
                <Route
                  exact
                  path="/"
                  render={props => {
                    return (
                      <IssueTable
                        projects={projects}
                        update={this.updateNotes}
                        sprints={sprints}
                        {...props}
                      />
                    );
                  }}
                />
                <Route
                  path="/sprint/:id?"
                  render={props => {
                    return (
                      <IssueTable
                        projects={projects}
                        update={this.updateNotes}
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
