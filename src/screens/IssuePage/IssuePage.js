import React, { Component } from "react";
import { connect } from "react-redux";
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
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import "./IssuePage.css";

import StatusDisplay from "../../components/Status/StatusDisplay";
import SprintDropDown from "../../components/SprintDropDown/SprintDropDown";
import ProjectDropDown from "../../components/ProjectDropDown/ProjectDropDown";

import {
  getIssue,
  updateIssue,
  deleteIssue,
  createTimeLog,
} from "../../utils/api";

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
    timeSpent: "0",
    timeSpentDelta: 0,
    timeRemaining: "0",
    timeRemainingDelta: 0,
    notes: "",
    blocked: "false",
    modalOpen: false,
    showMessage: false,
    message: "",
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
        blocked: issue.blocked,
        bad: issue.bad,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const issueId = nextProps.match.params.id;

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
        blocked: issue.blocked,
        bad: issue.bad,
      });
    });
  }

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
      blocked,
      bad,
      timeSpentDelta,
      timeRemainingDelta,
    } = this.state;

    const requestObj = {
      name,
      sprintId,
      projectId,
      status,
      timeEstimate: parseFloat(timeEstimate),
      timeRemaining: parseFloat(timeRemaining),
      timeSpent: parseFloat(timeSpent),
      notes,
      blocked,
      bad,
    };

    // Save the updated issue in table
    updateIssue(requestObj, issueId).then(res => {
      if (!res || res.status !== "Success") {
        this.props.error("Failed to update issue");
      } else {
        this.setState({
          showMessage: true,
          message: "Issue updated successfully :P",
        });
        this.timeout = setTimeout(() => {
          this.setState({ showMessage: false });
        }, 2500);
      }
    });

    // Add a timelog if time changed
    const timeSpentRequestObj = {
      issueId,
      delta: timeSpentDelta,
      stat: "time_spent",
      createdAt: new Date().toISOString(),
      total: timeSpent,
    };
    timeSpentDelta > 0 && !bad && createTimeLog(timeSpentRequestObj);

    // Add a timelog if time changed
    const timeRemainingRequestObj = {
      issueId,
      delta: this.state.timeRemainingDelta,
      stat: "time_remaining",
      createdAt: new Date().toISOString(),
      total: timeRemaining,
    };
    timeRemainingDelta !== 0 && createTimeLog(timeRemainingRequestObj);

    // Reset time change
    this.setState({
      timeSpentDelta: 0,
      timeRemainingDelta: 0,
    });
  };

  handleDelete = () => {
    this.handleModalClose();
    deleteIssue(this.state.issueId).then(res => {
      if (!res || res.status !== "Success") {
        this.props.error("Failed to delete issue");
      }
    });
  };

  handleModalOpen = () => {
    this.setState({
      modalOpen: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      modalOpen: false,
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

  handleName = (event, { value }) => {
    this.setState({
      name: value,
    });
  };

  handleNotes = (event, { value }) => {
    this.setState({
      notes: value,
    });
  };

  handleEditName = () => {
    this.setState({
      editName: true,
    });
  };

  handleTimeRemaining = (event, { value }) => {
    const { timeRemaining, timeRemainingDelta } = this.state;
    const parsedVal = value === "" ? 0 : parseFloat(value);
    const parsedTimeRemaining = timeRemaining === "" ? 0 : parseFloat(timeRemaining);
    this.setState({
      timeRemainingDelta: timeRemainingDelta + parsedVal - parsedTimeRemaining,
      timeRemaining: value,
    });
  };

  handleTimeSpent = (event, { value }) => {
    const { timeSpent, timeSpentDelta } = this.state;
    const parsedVal = value === "" ? 0 : parseFloat(value);
    const parsedTimeSpent = timeSpent === "" ? 0 : parseFloat(timeSpent);
    this.setState({
      timeSpentDelta: timeSpentDelta + parsedVal - parsedTimeSpent,
      timeSpent: value,
    });
  };

  handleTimeEstimate = (event, { value }) => {
    this.setState({
      timeEstimate: value,
    });
  };

  handleBlockedChange = () => {
    this.setState({
      blocked: this.state.blocked === "true" ? "false" : "true",
    });
  };

  handleStatusChange = (event, { name }) => {
    this.setState({
      status: name,
    });
  };

  handleMessageClose = () => {
    this.setState({
      showMessage: false,
    });
    clearTimeout(this.timeout);
  };

  renderTextArea = () => {
    return (
      <TextArea
        onChange={this.handleNotes}
        style={{
          minHeight: 250,
          backgroundColor: "#282828",
          color: "#BEBEBE",
          fontSize: 17,
        }}
        placeholder="Issue notes..."
        value={this.state.notes}
      />
    );
  };

  render() {
    const {
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
      showMessage,
      bad,
    } = this.state;
    const { sprintList, projectList } = this.props;

    return (
      <div>
        <Message
          hidden={!showMessage}
          positive
          onDismiss={this.handleMessageClose}
        >
          <Message.Header>{this.state.message}</Message.Header>
        </Message>
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
              <Header as="h1">
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

        <Form className="Left">
          <Form.Field width={3}>
            <label>Sprint</label>
            <SprintDropDown
              value={sprintId}
              sprints={sprintList}
              onChange={this.handleSprintSelect}
            />
          </Form.Field>

          <Form.Field width={3}>
            <label>Project</label>

            <ProjectDropDown
              value={projectId}
              projects={projectList}
              onChange={this.handleProjectSelect}
            />
          </Form.Field>

          <Form.Field>
            <label>Type</label>
            <Button.Group>
              <Button
                color={!bad ? "red" : "black"}
                onClick={() => this.setState({ bad: 0 })}
              >
                <Icon color={!bad ? "black" : "red"} name="thumbs up" />
              </Button>

              <Button.Or />

              <Button
                color={bad ? "red" : "black"}
                onClick={() => this.setState({ bad: 1 })}
              >
                <Icon color={bad ? "black" : "red"} name="thumbs down" />
              </Button>
            </Button.Group>
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
            <Button onClick={this.handleSubmit} color="black">
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

const mapStateToProps = state => ({
  projectList: state.commonData.projects.data || [],
  sprintList: state.commonData.sprintList.data || [],
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IssueDisplay);
