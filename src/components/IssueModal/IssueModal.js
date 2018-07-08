import React, { Component } from "react";
import "./IssueModal.css";
import { Icon, Button, Modal, Input, Form } from "semantic-ui-react";

import { createIssue } from "../../utils/api/api";
import ProjectDropDown from "../ProjectDropDown/ProjectDropDown";
import SprintDropDown from "../SprintDropDown/SprintDropDown";

class IssueModal extends Component {
  state = {
    name: "",
    timeEstimate: 0,
    projectId: 0,
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

  handleProjectSelect = (event, { value }) => {
    this.setState({
      projectId: value
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
    const { modalOpen } = this.state;

    const { sprints, projects } = this.props;

    return (
      <Modal
        size="tiny"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button icon labelPosition="right" onClick={this.handleOpen} primary>
            <Icon name="plus" />
            New issue
          </Button>
        }
        className="Modal"
      >
        <Modal.Header className="ModalHeader">Create Issue</Modal.Header>
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
          <Form.Field inline>
            <label>Project</label>
            <ProjectDropDown
              projects={projects}
              onChange={this.handleProjectSelect}
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

export default IssueModal;
