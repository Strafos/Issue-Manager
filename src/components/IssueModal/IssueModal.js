import React, { Component } from "react";
import "./IssueModal.css";
import { Button, Modal, Input, Form } from "semantic-ui-react";
import SprintDropDown from "../SprintDropDown/SprintDropDown";

import { createIssue } from "../../utils/api/api";

class IssueModal extends Component {
  state = {
    name: "",
    timeEstimate: 0,
    projectId: null,
    sprintId: 0,
    modalOpen: false
  };

  handleOpen = () =>
    this.setState({
      modalOpen: true
    });

  handleClose = () =>
    this.setState({
      modalOpen: false
    });

  handleName = (event, { value }) => {
    this.setState({
      name: value
    });
  };

  handleTime = (event, { value }) => {
    this.setState({
      timeEstimate: value
    });
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      sprintId: value
    });
  };

  handleValidate = () => {
    const { name, timeEstimate, sprintId } = this.state;
    return name.length === 0 || timeEstimate === 0 || sprintId === 0;
  };

  handleSubmit = () => {
    const { sprintId, name, timeEstimate, projectId } = this.state;
    const requestObj = {
      sprintId,
      name,
      timeSpent: 0,
      timeEstimate,
      timeRemaining: timeEstimate,
      status: "In queue", //In queue
      blocked: 0, // not blocked
      projectId
    };
    createIssue(requestObj);
    this.handleClose();
  };

  render() {
    const {
      name,
      status,
      timeEstimate,
      timeRemaining,
      projectId,
      blocked,
      modalOpen
    } = this.state;

    const { sprintId, sprints, projects } = this.props;

    return (
      <Modal
        size="tiny"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button onClick={this.handleOpen} primary>
            Create new issue
          </Button>
        }
        className="Modal"
      >
        <Modal.Header className="ModalHeader">Create Issue</Modal.Header>
        {/* <Form> */}
        <Form className="ModalForm">
          <Form.Field inline>
            <label>Issue Name</label>
            <Input size="tiny" type="text" onChange={this.handleName} />
          </Form.Field>
          <Form.Field inline>
            <label>Sprint</label>
            <SprintDropDown
              sprints={sprints}
              onChange={this.handleSprintSelect}
            />
          </Form.Field>
          <Form.Field inline>
            <label>Time Est.</label>
            <Input size="tiny" type="text" onChange={this.handleTime} />
          </Form.Field>
          {/* <Form.Field inline>
            <label>Project</label>
            <SprintDropDown
              sprints={sprints}
              // onChange={this.handleSprintSelect}
            />
          </Form.Field> */}
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

export default IssueModal;
