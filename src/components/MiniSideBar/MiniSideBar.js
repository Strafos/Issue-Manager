import React, { Component } from "react";
import { Grid, Button } from "semantic-ui-react";
import { connect } from "react-redux";

import IssueModal from "../Modal/IssueModal/IssueModal";
import ProjectModal from "../Modal/ProjectModal/ProjectModal";
import SprintModal from "../Modal/SprintModal/SprintModal";
import TodoList from "../TodoList/TodoList";
import Jots from "../Jots/Jots";
import Editor from "../Editor/Editor";

// Sidebar with the excess striped away

class MiniSideBar extends Component {
  render() {
    const { sprintList, projectList } = this.props;

    return (
      <Grid.Column width={3}>
        <Grid.Row>
          <br />
          <Button.Group color="black" vertical>
            <SprintModal sprints={sprintList} />
            <IssueModal text="New Note" projects={projectList} sprints={sprintList} />
            <ProjectModal sprints={sprintList} projects={projectList} />
          </Button.Group>
        </Grid.Row>
        <Grid.Row>
          <div className="center">
            <br />
            <TodoList />
            <Jots />
          </div>
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
)(MiniSideBar);
