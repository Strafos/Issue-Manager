import React, { Component } from "react";
import { Icon, Button, Modal, Input, Form } from "semantic-ui-react";
import ReactDatePicker from "react-datepicker";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import { connect } from "react-redux";

import * as API from "../../../utils/api";

import "rc-time-picker/assets/index.css";
import "react-datepicker/dist/react-datepicker.css";

class ReminderModal extends Component {
  state = {
    text: "",
    date: null,
    time: null,
    modalOpen: false,
  };

  padding = {
    padding: "5px",
    textAlign: "center",
  };

  center = {
    "text-align": "center",
  };

  handleOpen = () =>
    this.setState({
      modalOpen: true,
    });

  handleClose = event => {
    this.setState({
      modalOpen: event instanceof MouseEvent ? true : false,
    });
  };

  handleValidate = () => {
    const { text, date } = this.state;
    return text.length === 0 || date === null;
  };

  handleChangeDate = date => {
    this.setState({
      date,
    });
  };

  handleChangeTime = moment => {
    this.setState({
      time: moment,
    });
  };

  handleText = (event, { value }) => {
    this.setState({
      text: value,
    });
  };

  handleSubmit = () => {
    const { date, text, time } = this.state;
    time.set({ 'year': date.year(), 'month': date.month(), 'day': date.day() })
    const now = moment();
    const diffInMinutes = time.diff(now, 'minutes');
    const requestObj = {
      text,
      diffInMinutes,
      timestamp: now.toISOString(),
      reminderTime: time.toISOString(),
    };
    API.createReminder(requestObj);
    this.handleClose();
  };

  render() {
    const { date, modalOpen } = this.state;

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button icon labelPosition="left" onClick={this.handleOpen} primary>
            New Reminder
            <Icon color="red" name="plus" />
          </Button>
        }
      >
        <Modal.Header className="ModalHeader">Create Reminder</Modal.Header>
        <Form className="ModalForm">
          <Form.Field>
            <label>Date</label>
            <ReactDatePicker
              selected={date}
              onChange={this.handleChangeDate}
            />
          </Form.Field>
          <Form.Field>
            <TimePicker showSecond={false} use12Hours onChange={this.handleChangeTime} />
          </Form.Field>
          <Form.Field>
            <label>Text</label>
            <Input size="tiny" type="text" onChange={this.handleText} />
          </Form.Field>
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            style={this.padding}
            color="red"
          >
            Create Reminder
              </Button>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReminderModal);
