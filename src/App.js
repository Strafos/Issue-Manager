import React, { Component } from "react";
import "./App.css";
import { Button, Modal, Dropdown, Form } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

import SprintModal from "./components/SprintModal/SprintModal";
import SprintDropDown from "./components/SprintDropDown/SprintDropDown";
import IssueModal from "./components/IssueModal/IssueModal";
import IssueTable from "./components/IssueTable/IssueTable";

import {
  createSprint,
  createIssue,
  getSprints,
  getProjects
} from "./utils/api/api";

class App extends Component {
  state = {
    sprints: [],
    selectedSprint: null
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      selectedSprint: value
    });
  };

  componentDidMount() {
    getSprints().then(sprints => {
      this.setState({ sprints });
      this.setState({
        selectedSprint:
          sprints && sprints.length > 0 ? sprints[sprints.length - 1].id : null //Default to latest sprint
      });
    });
  }

  render() {
    const { sprints, selectedSprint } = this.state;

    return (
      <div className="App">
        <SprintModal sprints={sprints} />
        <ProjectModal sprints={sprints} />
        <IssueModal sprints={sprints} sprintId={selectedSprint} />
        <SprintDropDown sprints={sprints} onChange={this.handleSprintSelect} />
        <IssueTable sprintId={selectedSprint || 0} />
      </div>
    );
  }
}

export default App;
