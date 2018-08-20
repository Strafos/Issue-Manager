import React, { Component } from "react";
import { Button, Modal, Form, Input, Label, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import { setTime, createTimeLog } from "../../utils/api";

import * as Actions from "./timeCounterActions";

class TimeCounter extends Component {
  state = {
    time: 0,
    openModal: false,
    tempTime: "",
  };

  // componentDidMount() {
  //   const { time } = this.props;
  //   this.setState({
  //     time,
  //   });
  // }

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
    const digitRe = /^[0-9]+$/;
    return !tempTime.length > 0 || !digitRe.test(tempTime);
  };

  // Click from an icon
  handleIconClick = () => {
    const { issueId, inc, stat, time } = this.props;
    // const { time } = this.state;
    let newTime = inc ? time + 1 : time - 1;
    newTime = newTime < 0 ? 0 : newTime;
    const delta = newTime - time;

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

    // Update time displayed in TimeCounter
    this.setState({
      openModal: false,
    });

    // Update time in database
    // setTime(issueId, stat, newTime);
    this.props.setTime(issueId, stat, newTime);
  };

  handleSubmit = () => {
    const { issueId, stat } = this.props;
    const { tempTime, time } = this.state;
    const newTime = parseInt(tempTime, 10);

    const delta = newTime - time;

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

    // Update time displayed in TimeCounter
    this.setState({
      time: newTime,
      openModal: false,
    });

    //Update time in database
    setTime(issueId, stat, newTime);
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
                onClick={this.handleSubmit}
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
  // time: state.commonData.sprint.data && state.commonData.sprint.data,
});

const mapDispatchToProps = {
  setTime: Actions.setTime,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeCounter);
