import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./RecentMenu.css";
import { Menu, Container, Button } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

class RecentMenu extends Component {
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
    const { sprints } = this.props;
    console.log(this.props.ssprint);

    sprints.sort((a, b) => {
      return new Date(a.start_date) - new Date(b.start_date);
    });

    const len = sprints.length;

    return (
      <div className="center">
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>Recent Sprints</Menu.Header>

            <Menu.Menu>
              {sprints
                .slice(len - 4, len)
                .map(sprint => this.renderSprints(sprint))}
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedSprint: state.commonData.sprint.data && state.commonData.sprint.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecentMenu);
