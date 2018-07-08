import React, { Component } from "react";
import "./IssueTable.css";
import { Table } from "semantic-ui-react";

import Status from "../Status/Status";
import TimeCounter from "../TimeCounter/TimeCounter";

import { getSprint } from "../../utils/api/api";

class IssueTable extends Component {
  state = {
    issueList: []
  };

  mapProjectId = id => {
    const { projects } = this.props;
    const project = projects.find(proj => proj.id === id);
    return project ? project.name : "";
  };

  componentWillReceiveProps(nextProps) {
    const { sprintId } = nextProps;
    getSprint(sprintId).then(issues => {
      this.setState({
        issueList: issues
      });
    });
  }

  renderIssue = issue => {
    const {
      id,
      name,
      status,
      time_spent,
      time_estimate,
      time_remaining,
      project_id,
      blocked
    } = issue;
    const { projects } = this.props;
    console.log(projects);
    return (
      <Table.Row key={id}>
        <Table.Cell collapsing>{name}</Table.Cell>
        <Table.Cell collapsing>{this.mapProjectId(project_id)}</Table.Cell>
        <Table.Cell collapsing>
          <Status issueId={id} blocked={blocked === "true"} status={status} />
        </Table.Cell>
        <Table.Cell textAlign="left" collapsing>
          <TimeCounter
            issueId={id}
            inc={true}
            stat="time_spent"
            time={time_spent}
          />
        </Table.Cell>
        <Table.Cell textAlign="right" collapsing>
          <TimeCounter
            issueId={id}
            inc={false}
            stat="time_remaining"
            time={time_remaining}
          />
        </Table.Cell>
        <Table.Cell textAlign="right" collapsing>
          {time_estimate}
        </Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { issueList } = this.state;

    return (
      <div className="Table">
        <Table celled size="large" compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={1}>Name</Table.HeaderCell>
              <Table.HeaderCell width={1}>Project</Table.HeaderCell>
              <Table.HeaderCell width={1}>Status</Table.HeaderCell>
              <Table.HeaderCell width={1}>Time Spent</Table.HeaderCell>
              <Table.HeaderCell width={1}>Time Remaining</Table.HeaderCell>
              <Table.HeaderCell width={1}>Time Estimate</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{issueList.map(this.renderIssue)}</Table.Body>
        </Table>
      </div>
    );
  }
}

export default IssueTable;
