import React, { Component } from "react";
import "./TimeCounter.css";
import { Button, Modal, Form, Input, Label, Icon } from "semantic-ui-react";

import { setTime } from "../../utils/api/api";

class TimeCounter extends Component {
  state = {
    time: 0,
    openModal: false,
    tempTime: ""
  };

  componentDidMount() {
    const { time } = this.props;
    this.setState({
      time
    });
  }

  handleClick = () => {
    const { issueId, inc, stat } = this.props;
    const { time } = this.state;
    let newTime = inc ? time + 1 : time - 1;
    newTime = newTime < 0 ? 0 : newTime;
    this.setState({
      time: newTime,
      openModal: false
    });
    setTime(issueId, stat, newTime);
  };

  handleOpen = () => {
    this.setState({
      openModal: true
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false
    });
  };

  handleTempTime = (event, { value }) => {
    this.setState({
      tempTime: value
    });
  };

  handleValidate = () => {
    const { tempTime } = this.state;
    const digitRe = /^[0-9]+$/;
    return !tempTime.length > 0 || !digitRe.test(tempTime);
  };

  handleSubmit = () => {
    const { issueId, stat } = this.props;
    const { tempTime } = this.state;
    this.setState({
      time: parseInt(tempTime, 10)
    });
    setTime(issueId, stat, tempTime);
    this.handleClose();
  };

  render() {
    const { inc } = this.props;
    const { openModal, time } = this.state;

    return (
      <div>
        <Modal
          size="mini"
          closeIcon
          onClose={this.handleClose}
          open={openModal}
        >
          <Modal.Content>
            <Form className="ModalForm">
              <Form.Field inline>
                <label>Time: </label>
                <Input size="tiny" type="text" onChange={this.handleTempTime} />
              </Form.Field>
              <Button
                onClick={this.handleSubmit}
                disabled={this.handleValidate()}
                color="green"
              >
                Save
              </Button>
            </Form>
          </Modal.Content>
        </Modal>
        <Button icon onClick={this.handleClick}>
          <Icon inverted color="red" name={inc ? "plus" : "minus"} />
        </Button>
        <Button as="div" labelPosition="right" onClick={this.handleOpen}>
          <Label as="a" basic pointing="left">
            {time}
          </Label>
        </Button>
      </div>
    );
  }
}

export default TimeCounter;
