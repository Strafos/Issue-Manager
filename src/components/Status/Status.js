import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";

import { setStatus, setBlocked } from "../../utils/api/api";

class Status extends Component {
  state = {
    status: null,
    blocked: false
  };

  componentWillReceiveProps(nextProps) {
    const { status, blocked } = nextProps;
    this.setState({
      status: status,
      blocked: blocked
    });
  }

  componentDidMount() {
    const { status, blocked } = this.props;
    this.setState({
      status: status,
      blocked: blocked
    });
  }

  handleItemClick = (e, { name }) => {
    const { issueId } = this.props;
    this.setState({ status: name });
    setStatus(issueId, name);
  };

  handleBlock = () => {
    const { issueId } = this.props;
    const { blocked } = this.state;
    this.setState({ blocked: !blocked });
    setBlocked(issueId, !blocked);
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
            <Icon inverted color="grey" name="clock outline" />
          </Menu.Item>

          <Menu.Item
            name="In progress"
            active={status === "In progress"}
            onClick={this.handleItemClick}
          >
            <Icon inverted name="play" />
          </Menu.Item>
          <Menu.Item
            name="Paused"
            active={status === "Paused"}
            onClick={this.handleItemClick}
          >
            <Icon inverted color="grey" name="pause" />
          </Menu.Item>

          <Menu.Item
            name="Done"
            active={status === "Done"}
            onClick={this.handleItemClick}
          >
            <Icon color="grey" inverted name="check" />
          </Menu.Item>
        </Menu>
        {"     "}
        <Menu icon="labeled" compact size="mini">
          <Menu.Item
            name="block"
            color="red"
            active={blocked}
            onClick={this.handleBlock}
          >
            <Icon inverted name="ban" />
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default Status;
