import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

/*
* Displays status without sending db queries on change
*/
class StatusDisplay extends Component {
  render() {
    const { status, blocked, statusChange, blockedChange } = this.props;

    return (
      <Menu icon="labeled" compact size="mini">
        <Menu.Item
          name="In queue"
          active={status === "In queue"}
          onClick={statusChange}
        >
          <Icon inverted color="grey" name="clock outline" />
        </Menu.Item>

        <Menu.Item
          name="In progress"
          active={status === "In progress"}
          onClick={statusChange}
        >
          <Icon inverted color="grey" name="play" />
        </Menu.Item>
        <Menu.Item
          name="Paused"
          active={status === "Paused"}
          onClick={statusChange}
        >
          <Icon inverted color="grey" name="pause" />
        </Menu.Item>

        <Menu.Item
          name="Done"
          active={status === "Done"}
          onClick={statusChange}
        >
          <Icon color="grey" inverted name="check" />
        </Menu.Item>
        <Menu.Item name="block" active={blocked} onClick={blockedChange}>
          <Icon inverted name="ban" />
        </Menu.Item>
      </Menu>
    );
  }
}

export default StatusDisplay;
