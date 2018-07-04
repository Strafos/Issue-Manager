import React, { Component } from "react";
import "./SprintModal.css";
import { Button, Modal, Input, Form } from "semantic-ui-react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

import createSprint from "../../utils/api/api";

import "react-datepicker/dist/react-datepicker.css";

class SprintModal extends Component {
  state = {
    name: "",
    startDate: null,
    endDate: null,
    modalOpen: false
  };

  padding = {
    padding: "10px",
    textAlign: "center"
  };

  center = {
    "text-align": "center"
  };

  handleOpen = () =>
    this.setState({
      modalOpen: true
    });

  handleClose = () =>
    this.setState({
      modalOpen: false
    });

  handleValidate = () => {
    const { name, startDate, endDate } = this.state;
    return name.length === 0 || startDate === null || endDate === null;
  };

  handleChangeStartDate = date => {
    this.setState({
      startDate: date
    });
  };

  handleChangeEndDate = date => {
    this.setState({
      endDate: date
    });
  };

  handleName = (event, { value }) => {
    this.setState({
      name: value
    });
  };

  handleSubmit = () => {
    const { startDate, endDate, name } = this.state;
    const requestObj = {
      name,
      startDate,
      endDate
    };
    createSprint(requestObj);
    this.handleClose();
  };

  render() {
    const { name, startDate, endDate, modalOpen } = this.state;
    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button onClick={this.handleOpen} primary>
            Create new sprint
          </Button>
        }
      >
        <Modal.Header className="ModalHeader">Create Sprint</Modal.Header>
        <Form className="ModalForm">
          <Form.Field>
            <label>Sprint Name</label>
            <Input size="tiny" type="text" onChange={this.handleName} />
          </Form.Field>
          <Form.Field inline>
            <ReactDatePicker
              selected={startDate}
              onChange={this.handleChangeStartDate}
            />
          </Form.Field>
          <Form.Field inline>
            <ReactDatePicker
              selected={endDate}
              onChange={this.handleChangeEndDate}
            />
          </Form.Field>
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            style={this.padding}
            color="green"
          >
            Create Sprint
          </Button>
        </Form>
      </Modal>
    );
  }
}

export default SprintModal;
