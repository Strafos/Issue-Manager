import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

import { setStatus, setBlocked } from "../../utils/api";

class Status extends Component {
  state = {
    status: null,
    blocked: false,
  };

  componentDidMount() {
    const { status, blocked } = this.props;
    this.setState({
      status: status,
      blocked: blocked,
    });
  }

  componentDidUpdate(prevProps) {
    const { status, blocked } = this.props;
    if (status !== prevProps.status || blocked !== prevProps.blocked) {
      this.setState({
        status,
        blocked,
      });
    }
  }

  handleItemClick = (e, { name }) => {
    const { issueId } = this.props;
    this.setState({ status: name });
    setStatus(issueId, name).then(res => {
      if (!res || res.status !== "Success") {
        this.props.error("Failed to set new status");
      }
    });
    this.props.update(issueId, name);
  };

  handleBlock = () => {
    const { issueId } = this.props;
    const { blocked } = this.state;
    this.setState({ blocked: !blocked });
    setBlocked(issueId, !blocked).then(res => {
      if (!res || res.status !== "Success") {
        this.props.error("Failed to set block status");
      }
    });
  };

  render() {
    const { status, blocked } = this.state;

    return (
      <div>
        <Menu icon="labeled" compact size="mini">
          <Menu.Item
            name="In queue"
            active={status === "In queue"}
            onClick={this.handleItemClick}
          >
            <Icon
              inverted
              color={status === "In queue" ? "red" : "grey"}
              name="clock outline"
            />
          </Menu.Item>

          <Menu.Item
            name="In progress"
            active={status === "In progress"}
            onClick={this.handleItemClick}
          >
            <Icon
              inverted
              color={status === "In progress" ? "red" : "grey"}
              name="play"
            />
          </Menu.Item>

          <Menu.Item
            name="Done"
            active={status === "Done"}
            onClick={this.handleItemClick}
          >
            <Icon
              color={status === "Done" ? "red" : "grey"}
              inverted
              name="check"
            />
          </Menu.Item>
          <Menu.Item
            name="Paused"
            active={status === "Paused"}
            onClick={this.handleItemClick}
          >
            <Icon
              inverted
              color={status === "Paused" ? "red" : "grey"}
              name="sync"
            />
          </Menu.Item>
        </Menu>
        {"     "}
        <Menu icon="labeled" compact size="mini">
          <Menu.Item name="block" active={blocked} onClick={this.handleBlock}>
            <Icon inverted color={blocked ? "red" : "grey"} name="ban" />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default Status;
