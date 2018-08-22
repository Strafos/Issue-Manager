import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./SprintMenu.css";
import { Menu, Loader } from "semantic-ui-react";

import * as CommonActions from "../../commonActions";

import "react-datepicker/dist/react-datepicker.css";

class SprintMenu extends Component {
  componentDidMount() {
    this.props.getSprints();
  }

  renderSprints = sprint => {
    const { selectedSprint } = this.props;
    return (
      <Menu.Item
        key={sprint.id}
        content={sprint.name}
        index={sprint.id}
        active={selectedSprint && selectedSprint.name === sprint.name}
        onClick={this.props.handleSprintMenuClick}
        as={Link}
        to={`/sprint/${sprint.id}`}
      />
    );
  };

  render() {
    const { sprintList } = this.props;

    if (!sprintList) {
      return <Loader active inline />;
    }

    sprintList.sort((a, b) => {
      return new Date(a.start_date) - new Date(b.start_date);
    });

    const len = sprintList.length;

    return (
      <div className="center">
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>Recent Sprints</Menu.Header>

            <Menu.Menu>
              {len > 4
                ? sprintList
                    .slice(len - 4, len)
                    .map(sprint => this.renderSprints(sprint))
                : sprintList.map(sprint => this.renderSprints(sprint))}
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedSprint: state.commonData.sprint.data,
  sprintList: state.commonData.sprintList.data,
});

const mapDispatchToProps = {
  getSprints: CommonActions.getAllSprints,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintMenu);
