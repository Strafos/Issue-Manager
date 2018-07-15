import React, { Component } from "react";
import "./IssueDisplay.css";
import {
  Modal,
  Grid,
  Input,
  Icon,
  Button,
  Form,
  TextArea,
  Message,
  Header,
  HeaderContent
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import StatusDisplay from "../StatusDisplay/StatusDisplay";
import TimeCounter from "../TimeCounter/TimeCounter";
import SprintDropDown from "../SprintDropDown/SprintDropDown";
import ProjectDropDown from "../ProjectDropDown/ProjectDropDown";

import {
  getIssue,
  addRecentIssue,
  updateIssue,
  deleteIssue
} from "../../utils/api/api";

class IssueDisplay extends Component {
  state = {
    selectedIssue: null,
    editName: false,
    issueId: 0,
    name: "",
    sprintId: 0,
    projectId: 0,
    status: "",
    timeEstimate: 0,
    timeSpent: 0,
    timeRemaining: 0,
    notes: "",
    blocked: "false",
    modalOpen: false,
    showMessage: false
  };

  componentDidMount() {
    const issueId = this.props.match.params.id;

    getIssue(issueId).then(issues => {
      const issue = issues[0];
      this.setState({
        selectedIssue: issue,
        issueId: issueId,

        name: issue.name,
        sprintId: issue.sprint_id,
        projectId: issue.project_id,
        status: issue.status,
        timeEstimate: issue.time_estimate,
        timeSpent: issue.time_spent,
        timeRemaining: issue.time_remaining,
        notes: issue.notes,
        blocked: issue.blocked
      });
      issueId && this.addRecentIssue(issueId, issue.name);
    });
  }

  sprintOptions = sprints =>
    sprints.map(sprint => {
      return {
        text: sprint.name,
        key: sprint.id,
        value: sprint.id
      };
    });

  handleSubmit = () => {
    const {
      issueId,
      name,
      sprintId,
      projectId,
      status,
      timeEstimate,
      timeRemaining,
      timeSpent,
      notes,
      blocked
    } = this.state;
    const requestObj = {
      name,
      sprintId,
      projectId,
      status,
      timeEstimate,
      timeRemaining,
      timeSpent,
      notes,
      blocked
    };
    updateIssue(requestObj, issueId);
    this.setState({
      showMessage: true
    });
  };

  handleDelete = () => {
    this.handleModalClose();
    deleteIssue(this.state.issueId);
  };

  handleModalOpen = () => {
    this.setState({
      modalOpen: true
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false
    });
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      sprintId: value
    });
  };

  handleName = (event, { value }) => {
    this.setState({
      name: value
    });
  };

  handleNotes = (event, { value }) => {
    this.setState({
      notes: value
    });
  };

  handleEditName = () => {
    this.setState({
      editName: true
    });
  };

  handleTimeRemaining = (event, { value }) => {
    this.setState({
      timeRemaining: value
    });
  };

  handleTimeEstimate = (event, { value }) => {
    this.setState({
      timeEstimate: value
    });
  };

  handleTimeSpent = (event, { value }) => {
    this.setState({
      timeSpent: value
    });
  };

  handleBlockedChange = () => {
    this.setState({
      blocked: this.state.blocked === "true" ? "false" : "true"
    });
  };

  handleStatusChange = (event, { name }) => {
    this.setState({
      status: name
    });
  };

  handleMessageClose = () => {
    this.setState({
      showMessage: false
    });
  };

  addRecentIssue = (id, name) => {
    console.log("foo");
    addRecentIssue(id, name);
  };

  renderTextArea = () => {
    return (
      <TextArea
        onChange={this.handleNotes}
        style={{ minHeight: 150 }}
        placeholder="Issue notes..."
        value={this.state.notes}
      />
    );
  };

  renderMessage = () => {
    return (
      <Message positive onDismiss={this.handleMessageClose}>
        <Message.Header>Save successful :P</Message.Header>
      </Message>
    );
  };

  render() {
    const {
      issueId,
      editName,
      name,
      sprintId,
      projectId,
      status,
      timeEstimate,
      timeRemaining,
      timeSpent,
      blocked,
      modalOpen,
      showMessage
    } = this.state;
    const { sprints, projects } = this.props;

    return (
      <div>
        {showMessage && this.renderMessage()}
        <div className="Left">
          {editName ? (
            <Form>
              <Form.Field inline>
                <Input
                  value={name}
                  size="tiny"
                  type="text"
                  onChange={this.handleName}
                />
              </Form.Field>
            </Form>
          ) : (
            <Header as="h2">
              <Header.Content>
                {name}
                <Icon
                  className="super"
                  name="edit"
                  size="mini"
                  fitted
                  onClick={this.handleEditName}
                />
              </Header.Content>
            </Header>
          )}
        </div>
        <br />
        <Form className="Left">
          <Form.Field width={3}>
            <label>Sprint</label>
            <SprintDropDown
              value={sprintId}
              sprints={sprints}
              onChange={this.handleSprintSelect}
            />
          </Form.Field>
          <Form.Field width={3}>
            <label>Project</label>
            <ProjectDropDown
              value={projectId}
              projects={projects}
              onChange={this.handleProjectSelect}
            />
          </Form.Field>
          <Form.Field width={3}>
            <label>Status</label>
            <StatusDisplay
              statusChange={this.handleStatusChange}
              blockedChange={this.handleBlockedChange}
              blocked={blocked === "true"}
              status={status}
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Time Spent"
              value={timeSpent}
              onChange={this.handleTimeSpent}
            />
            <Form.Input
              fluid
              label="Time Remaining"
              value={timeRemaining}
              onChange={this.handleTimeRemaining}
            />
            <Form.Input
              fluid
              label="Time Estimate"
              value={timeEstimate}
              onChange={this.handleTimeEstimate}
            />
          </Form.Group>
        </Form>
        <Form className="Left">
          <Form.Field control={this.renderTextArea} label="Issue Notes" />
        </Form>
        <br />
        <Grid columns={2}>
          <Grid.Column className="Left" width={8}>
            <Button onClick={this.handleSubmit} color="green">
              Save Changes
            </Button>
          </Grid.Column>
          <Grid.Column className="Right" width={8}>
            <Modal
              basic
              size="small"
              open={modalOpen}
              onClose={this.handleModalClose}
              trigger={
                <Button color="red" onClick={this.handleModalOpen}>
                  Delete Issue
                </Button>
              }
            >
              <Header icon="trash alternate outline" content="Delete Issue" />
              <Modal.Content>
                <p>Are you sure you want to delete this issue?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  basic
                  color="red"
                  inverted
                  onClick={this.handleModalClose}
                >
                  <Icon name="remove" /> No
                </Button>
                <Button
                  as={Link}
                  to="/"
                  color="green"
                  inverted
                  onClick={this.handleDelete}
                >
                  <Icon name="checkmark" /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default IssueDisplay;
