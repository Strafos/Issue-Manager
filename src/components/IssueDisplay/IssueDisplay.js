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
    getIssue(issueId).then(issue => this.setState({ selectedIssue: issue }));
  }

  render() {
    const { selectedIssue } = this.state;
    console.log(selectedIssue);

    return (
      <div>
        <Header floated="left" as="h2">
          {selectedIssue && selectedIssue.name}
        </Header>
        <Form textAlign="left">
          <Form.Field control={this.renderTextArea} label="Notes" />
        </Form>
        <br />
        <div className="Right">
          <Button color="green" onClick={this.handleSaveNotes}>
            Save notes
          </Button>
        </div>
      </div>
    );
  }
}

export default IssueDisplay;
