import React, { Component } from "react";
import "./RecentMenu.css";
import { Menu, Grid, Button, Modal, Input, Form } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

class RecentMenu extends Component {
  renderSprints = sprint => {
    const { selectedSprint } = this.props;
    return (
      <Menu.Item
        content={sprint.name}
        index={sprint.id}
        active={selectedSprint && selectedSprint.name === sprint.name}
        onClick={this.props.handleSprintMenuClick}
      />
    );
  };

  render() {
    const { sprints } = this.props;

    sprints.sort((a, b) => {
      return new Date(a.start_date) - new Date(b.start_date);
    });

    return (
      <Menu vertical>
        <Menu.Item>
          <Menu.Header>Recent Sprints</Menu.Header>

          <Menu.Menu>
            {sprints.slice(0, 3).map(sprint => this.renderSprints(sprint))}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}

export default RecentMenu;
