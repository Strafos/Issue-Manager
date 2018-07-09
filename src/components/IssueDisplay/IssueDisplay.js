import React, { Component } from "react";
import "./IssueDisplay.css";
import { Button, Form, TextArea, Table, Header } from "semantic-ui-react";

import Status from "../Status/Status";
import TimeCounter from "../TimeCounter/TimeCounter";

import { getIssue } from "../../utils/api/api";

class IssueDisplay extends Component {
  state = {
    selectedIssue: null
  };

  componentDidMount() {
    const issueId = this.props.match.params.id;
    getIssue(issueId).then(issues =>
      this.setState({ selectedIssue: issues[0] })
    );
  }

  render() {
    const { selectedIssue } = this.state;
    console.log(selectedIssue);
    console.log(selectedIssue && selectedIssue.name);

    return (
      <div>
        <Header floated="left" as="h2">
          {selectedIssue && selectedIssue.name}
        </Header>
        {/* <Form textAlign="left">
          <Form.Field control={this.renderTextArea} label="Notes" />
        </Form> */}
        <br />
      </div>
    );
  }
}

export default IssueDisplay;
