import React, { Component } from "react";
import "./IssueModal.css";
import {
  TextArea,
  Container,
  Icon,
  Button,
  Modal,
  Input,
  Form,
  Divider,
} from "semantic-ui-react";
import { connect } from "react-redux";

import * as CommonActions from "../../../commonActions";

import { createIssue } from "../../../utils/api";
import ProjectDropDown from "../../ProjectDropDown/ProjectDropDown";
import SprintDropDown from "./SprintDropDown";

class IssueModal extends Component {
  state = {
    name: "",
    timeEstimate: 0,
    projectId: 0,
    sprintId: 0,
    modalOpen: false,
    notes: "",
  };

  componentWillReceiveProps(nextProps) {
    const { selectedSprint } = nextProps;
    this.setState({
      sprintId: selectedSprint && selectedSprint.id,
    });
  }

  handleOpen = () =>
    this.setState({
      modalOpen: true,
    });

  handleClose = () =>
    this.setState({
      modalOpen: false,
    });

  handleName = (event, { value }) => {
    this.setState({
      name: value,
    });
  };

  handleTime = (event, { value }) => {
    this.setState({
      timeEstimate: value,
    });
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      sprintId: value,
    });
  };

  handleProjectSelect = (event, { value }) => {
    this.setState({
      projectId: value,
    });
  };

  handleNotes = (event, { value }) => {
    this.setState({
      notes: value,
    });
  };

  handleValidate = () => {
    const { name, timeEstimate, sprintId } = this.state;
    return name.length === 0 || timeEstimate === 0 || sprintId === 0;
  };

  handleSubmit = () => {
    const { sprintId, name, timeEstimate, projectId, notes } = this.state;
    const requestObj = {
      sprintId,
      name,
      timeSpent: 0,
      timeEstimate,
      timeRemaining: timeEstimate,
      status: "In queue", //In queue
      blocked: 0, // not blocked
      projectId,
      notes,
    };
    this.props.createIssue(requestObj);
    this.handleClose();
  };

  render() {
    const { modalOpen, sprintId } = this.state;

    const { sprints, projects, selectedSprint } = this.props;

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button icon labelPosition="left" onClick={this.handleOpen} primary>
            <Icon color="red" name="plus" />
            New issue
          </Button>
        }
        className="Modal"
      >
        <Modal.Header textAlign="left">Create Issue</Modal.Header>
        <Container textAlign="left">
          <Form>
            <Form.Field>
              <label>Issue Name</label>
              <Input size="tiny" type="text" onChange={this.handleName} />
            </Form.Field>
            <Form.Field>
              <label>Sprint</label>
              <SprintDropDown
                value={sprintId}
                sprints={sprints}
                onChange={this.handleSprintSelect}
              />
            </Form.Field>
            <Form.Field>
              <label>Time Est.</label>
              <Input size="tiny" type="text" onChange={this.handleTime} />
            </Form.Field>
            <Form.Field>
              <label>Project</label>
              <ProjectDropDown
                projects={projects}
                onChange={this.handleProjectSelect}
              />
            </Form.Field>
            <Form.Field>
              <label>Notes</label>
              <TextArea onChange={this.handleNotes} />
            </Form.Field>
          </Form>
          <Divider />
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            style={this.padding}
            color="green"
          >
            Create Issue
          </Button>
        </Container>
        <Container textAlign="center" />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  createIssue: CommonActions.createIssue,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueModal);
