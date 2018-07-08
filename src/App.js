import React, { Component } from "react";
import "./App.css";

import {
  Icon,
  Header,
  Button,
  Grid,
  GridColumn,
  GridRow
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";

import SprintModal from "./components/SprintModal/SprintModal";
import SprintDropDown from "./components/SprintDropDown/SprintDropDown";
import IssueModal from "./components/IssueModal/IssueModal";
import IssueTable from "./components/IssueTable/IssueTable";
import ProjectModal from "./components/ProjectModal/ProjectModal";

import { getSprints, getProjects } from "./utils/api/api";

class App extends Component {
  state = {
    sprints: [],
    selectedSprint: null
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id === value)
    });
  };

  selectSprint = sprints => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) - 7); // Current Monday

    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    const lastMonday = d.toLocaleDateString("en-US", options);
    return sprints.find(sprint => sprint.start_date === lastMonday);
  };

  componentDidMount() {
    getProjects().then(projects => {
      this.setState({ projects });
    });
    getSprints().then(sprints => {
      this.setState({ sprints });
      this.setState({
        selectedSprint:
          sprints && sprints.length > 0 ? this.selectSprint(sprints) : null
      });
    });
  }

  render() {
    const { sprints, projects, selectedSprint } = this.state;

    return (
      <div className="App">
        <div className="foo">
          <Header size="huge" as="h1">
            <Icon name="trash alternate outline" />
            Zaibo's Issue Manager
          </Header>
        </div>
        <Grid columns={2} divided>
          <Grid.Row />
          <Grid.Row>
            <GridColumn textAlign="right" width={3}>
              <Grid.Row>
                <Button.Group color="green" vertical>
                  <SprintModal sprints={sprints} />
                  <ProjectModal sprints={sprints} projects={projects} />
                  <IssueModal
                    projects={projects}
                    sprints={sprints}
                    sprintId={selectedSprint}
                  />
                </Button.Group>
              </Grid.Row>
              <br />
              <Grid.Row>
                <SprintDropDown
                  sprints={sprints}
                  onChange={this.handleSprintSelect}
                />
              </Grid.Row>
            </GridColumn>
            <GridColumn width={13}>
              <IssueTable
                projects={projects}
                selectedSprint={selectedSprint}
                sprintId={selectedSprint && selectedSprint.id}
              />
            </GridColumn>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
