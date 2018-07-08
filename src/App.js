import React, { Component } from "react";
import "./App.css";

import {
  Menu,
  TextArea,
  Icon,
  Header,
  Button,
  Grid,
  GridColumn,
  GridRow,
  Form
} from "semantic-ui-react";
import "react-datepicker/dist/react-datepicker.css";

import SprintModal from "./components/SprintModal/SprintModal";
import SprintDropDown from "./components/SprintDropDown/SprintDropDown";
import RecentMenu from "./components/RecentMenu/RecentMenu";
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

  handleSprintMenuClick = (event, { index }) => {
    this.setState({
      selectedSprint: this.state.sprints.find(sprint => sprint.id === index)
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

  updateNotes = notes => {
    const { selectedSprint } = this.state;
    selectedSprint.notes = notes;
    this.setState({
      selectedSprint
    });
  };

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
            <GridColumn width={3}>
              <Grid.Row>
                <br />
                <Button.Group color="green" vertical>
                  <SprintModal sprints={sprints} />
                  <ProjectModal sprints={sprints} projects={projects} />
                  <IssueModal
                    projects={projects}
                    sprints={sprints}
                    selectedSprint={selectedSprint}
                  />
                </Button.Group>
              </Grid.Row>
              <br />
              <Grid.Row>
                <RecentMenu
                  selectedSprint={selectedSprint}
                  handleSprintMenuClick={this.handleSprintMenuClick}
                  sprints={sprints}
                />
              </Grid.Row>
              <br />
              <Grid.Row>
                <SprintDropDown
                  sprints={sprints}
                  onChange={this.handleSprintSelect}
                  simple={true}
                />
              </Grid.Row>
            </GridColumn>
            <GridColumn width={13}>
              <IssueTable
                projects={projects}
                selectedSprint={selectedSprint}
                sprintId={selectedSprint && selectedSprint.id}
                update={this.updateNotes}
              />
            </GridColumn>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default App;
