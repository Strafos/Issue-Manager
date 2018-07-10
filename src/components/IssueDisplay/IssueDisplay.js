import React, { Component } from "react";
import "./IssueDisplay.css";
import {
  Input,
  Icon,
  Button,
  Form,
  TextArea,
  Table,
  Header,
  HeaderContent
} from "semantic-ui-react";

import Status from "../Status/Status";
import TimeCounter from "../TimeCounter/TimeCounter";
import SprintDropDown from "../SprintDropDown/SprintDropDown";

import { getIssue } from "../../utils/api/api";

class IssueDisplay extends Component {
  state = {
    selectedIssue: null,
    notes: "",
    editName: false
  };

  componentDidMount() {
    const issueId = this.props.match.params.id;
    getIssue(issueId).then(issues =>
      this.setState({ selectedIssue: issues[0] })
    );
  }

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

  render() {
    const { selectedIssue, editName } = this.state;
    const { sprints } = this.props;
    console.log(selectedIssue);

    return (
      <div>
        <div className="Left">
          {editName ? (
            <Form>
              <Form.Field inline>
                <Input
                  value={selectedIssue && selectedIssue.name}
                  size="tiny"
                  type="text"
                  onChange={this.handleName}
                />
              </Form.Field>
            </Form>
          ) : (
            <Header as="h2">
              <Header.Content>
                {selectedIssue && selectedIssue.name + " "}
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
            <label>Issue Name</label>
            {/* <Input width={5} type="text" onChange={this.handleName} /> */}
            <Input placeholder="tralalala" />
          </Form.Field>
          <Form.Field width={3}>
            <label>Sprint</label>
            <SprintDropDown
              // defaultVal={selectedIssue && selectedIssue.sprint_id}
              defaultVal={selectedIssue ? selectedIssue.sprint_id : 0}
              sprints={sprints}
              onChange={this.handleSprintSelect}
            />
          </Form.Field>
          <Form.Field>
            <label>Time Est.</label>
            <Input size="tiny" type="text" onChange={this.handleTime} />
          </Form.Field>
          <Form.Field inline>
            <label>Project</label>
            {/* <ProjectDropDown
              projects={projects}
              onChange={this.handleProjectSelect}
            /> */}
          </Form.Field>
        </Form>
        <Form textAlign="left">
          <Form.Field control={this.renderTextArea} label="Issue Notes" />
        </Form>
        <br />
      </div>
    );
  }
}

export default IssueDisplay;
