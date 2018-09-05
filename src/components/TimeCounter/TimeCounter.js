import React, { Component } from "react";
import { Button, Modal, Form, Input, Label, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import { createTimeLog } from "../../utils/api";

import * as Actions from "./timeCounterActions";
import { cleanNumber } from "../../utils/arithUtils";

class TimeCounter extends Component {
  state = {
    openModal: false,
    tempTime: "",
  };

  handleOpen = () => {
    this.setState({
      openModal: true,
    });
  };

  handleClose = () => {
    this.setState({
      openModal: false,
    });
  };

  handleTempTime = (event, { value }) => {
    this.setState({
      tempTime: value,
    });
  };

  // Time is composed of digits, so it must be positive
  handleValidate = () => {
    const { tempTime } = this.state;
    const digitRe = /^[0-9]+(\.[0-9]*)?$/;
    return !tempTime.length > 0 || !digitRe.test(tempTime);
  };

  // Click from an icon
  handleIconClick = () => {
    const { issueId, inc, stat, time, timeDeltaSetting } = this.props;
    let newTime = inc ? time + timeDeltaSetting : time - timeDeltaSetting;
    newTime = newTime < 0 ? 0 : newTime;
    const delta = newTime - time;

    this.handleTimeChange(issueId, delta, stat, newTime);
  };

  handleModalSubmit = () => {
    const { issueId, stat, time } = this.props;
    const { tempTime } = this.state;
    const newTime = parseFloat(tempTime, 10);
    const delta = newTime - time;

    this.handleTimeChange(issueId, delta, stat, newTime);
  };

  handleTimeChange = (issueId, delta, stat, newTime) => {
    // Make sure both numbers are precise to two decimals
    delta = cleanNumber(delta);
    newTime = cleanNumber(newTime);

    // Log time delta
    if (!this.props.bad) {
      const reqObj = {
        issueId,
        delta,
        stat,
        createdAt: new Date().toISOString(),
        total: newTime,
      };
      createTimeLog(reqObj);
    }

    // Update total time in sprint display
    this.props.timeTotals(stat, delta);

    this.setState({
      openModal: false,
    });

    // Update time in database
    this.props.setTime(issueId, stat, newTime);
  };

  render() {
    const { inc, time } = this.props;
    const { openModal } = this.state;

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
                onClick={this.handleModalSubmit}
                disabled={this.handleValidate()}
                color="green"
              >
                Save
              </Button>
            </Form>
          </Modal.Content>
        </Modal>
        <Button icon onClick={this.handleIconClick}>
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

const mapStateToProps = state => ({
  timeDeltaSetting: state.commonData.settings.data
    ? state.commonData.settings.data.timeDelta
    : 1,
});

const mapDispatchToProps = {
  setTime: Actions.setTime,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeCounter);
