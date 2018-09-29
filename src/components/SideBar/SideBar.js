import React, { Component } from "react";
import { Grid, Button } from "semantic-ui-react";
import { connect } from "react-redux";

import IssueModal from "../Modal/IssueModal/IssueModal";
import ProjectModal from "../Modal/ProjectModal/ProjectModal";
import SprintModal from "../Modal/SprintModal/SprintModal";
import SettingModal from "../Modal/SettingModal/SettingModal";
import SprintMenu from "../SprintMenu/SprintMenu";
import TodoList from "../TodoList/TodoList";
import TimeSpentMiniGraph from "../../screens/SprintPage/GraphDisplay/Graphs/TimeSpentMiniGraph";
import SprintDropDown from "../SprintDropDown/SprintDropDown";

class SideBar extends Component {
  render() {
    const { sprintList, projectList, selectedSprint, build } = this.props;

    return (
      <Grid.Column width={3}>
        {build === "dev" && <Grid.Row>DEV BUILD</Grid.Row>}

        <Grid.Row>
          <br />
          <Button.Group color="black" vertical>
            <SprintModal sprints={sprintList} />
            <ProjectModal sprints={sprintList} projects={projectList} />
            <IssueModal projects={projectList} sprints={sprintList} />
          </Button.Group>
        </Grid.Row>
        <br />

        <Grid.Row>
          <div className="center">
            <SprintMenu sprints={sprintList} />
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

        <Grid.Row>
          <SettingModal />
        </Grid.Row>

        <br />
        <Grid.Row>
          <SprintDropDown
            sprints={sprintList}
            onChange={this.handleSprintSelect}
            simple={true}
            link
          />
        </Grid.Row>
      </Grid.Column>
    );
  }
}

const mapStateToProps = state => ({
  projectList: state.commonData.projects.data || [],
  sprintList: state.commonData.sprintList.data || [],
  selectedSprint: state.commonData.sprint.data,
  build: state.commonData.settings.data && state.commonData.settings.data.build,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBar);
