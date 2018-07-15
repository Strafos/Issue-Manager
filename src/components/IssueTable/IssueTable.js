import _ from "lodash";
import React, { Component } from "react";
import "./IssueTable.css";
import { Icon, Button, Form, TextArea, Table, Header } from "semantic-ui-react";

import Status from "../Status/Status";
import TimeCounter from "../TimeCounter/TimeCounter";

import { getSprint, updateNotes } from "../../utils/api/api";

class IssueTable extends Component {
  state = {
    selectedSprint: null,
    issueList: [],
    notes: "",
    showNoteList: [],
    totalTimeSpent: 0,
    totalTimeRemaining: 0,
    totalTimeEstimate: 0,
    sortByColumn: null,
    direction: null
  };

  statusMap = {
    "In queue": 0,
    "In progress": 1,
    Paused: 2,
    Done: 3
  };

  mapProjectId = id => {
    const { projects } = this.props;
    const project = projects.find(proj => proj.id === id);
    return project ? project.name : "";
  };

  mapSprintId = id => {
    const { sprints } = this.props;
    const sprint = sprints.find(spr => spr.id === id);
    return sprint;
  };

  componentWillReceiveProps(nextProps) {
    const { match, sprints } = nextProps;

    const defaultSprint = this.getDefaultSprint(sprints);
    const defaultSprintId = defaultSprint ? defaultSprint.id : null;

    // If the id is part of the url params, use that, otherwise, display default sprint
    const id = match.params.id ? match.params.id : defaultSprintId;

    getSprint(id).then(issues => {
      const selectedSprint = sprints.find(spr => spr.id == id);
      const noteList = {};
      issues.map(issue => (noteList[issue.id] = false));

      // Issues, note toggle array, summing times for footer
      this.setState({
        selectedSprint,
        issueList: issues,
        showNoteList: noteList,
        totalTimeEstimate:
          issues.length > 0 &&
          issues.map(i => i.time_estimate).reduce((a, b) => a + b),
        totalTimeSpent:
          issues.length > 0 &&
          issues.map(i => i.time_spent).reduce((a, b) => a + b),
        totalTimeRemaining:
          issues.length > 0 &&
          issues.map(i => i.time_remaining).reduce((a, b) => a + b)
      });

      // SPRINT notes
      this.setState({
        notes: selectedSprint ? selectedSprint.notes : ""
      });

      // Want to sort by status by default
      this.handleStatusSort();
    });
  }

  getDefaultSprint = sprints => {
    const d = new Date();
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) - 7); // Current Monday

    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    const lastMonday = d.toLocaleDateString("en-US", options);
    return sprints.find(sprint => sprint.start_date === lastMonday);
  };

  handleStatusSort = () => {
    const { issueList } = this.state;
    this.setState({
      issueList: issueList.sort(
        (a, b) => this.statusMap[a.status] - this.statusMap[b.status]
      ),
      direction: "ascending",
      sortByColumn: "status"
    });
  };

  handleSort = clickedColumn => () => {
    const { sortByColumn, issueList, direction } = this.state;
    if (sortByColumn !== clickedColumn) {
      if (clickedColumn === "status") {
        this.handleStatusSort();
        return;
      }

      if (clickedColumn.includes("time")) {
        this.setState({
          sortByColumn: clickedColumn,
          issueList: _.sortBy(issueList, [clickedColumn]).reverse(),
          direction: "ascending"
        });
      }

      this.setState({
        sortByColumn: clickedColumn,
        issueList: _.sortBy(issueList, [clickedColumn]),
        direction: "descending"
      });

      return;
    }

    this.setState({
      issueList: issueList.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  // Resort after status is clicked. Not implementable currently because
  // the state management is handled by the Status component
  handleResort = () => {
    const { sortByColumn, issueList, direction } = this.state;
    if (sortByColumn === "status") {
      this.handleStatusSort();
      return;
    }

    if (sortByColumn.includes("time")) {
      this.setState({
        sortByColumn: sortByColumn,
        issueList: _.sortBy(issueList, [sortByColumn]).reverse(),
        direction: "ascending"
      });
    }

    this.setState({
      sortByColumn: sortByColumn,
      issueList: _.sortBy(issueList, [sortByColumn]),
      direction: "descending"
    });
  };

  handleNotes = (event, { value }) => {
    this.setState({
      notes: value
    });
  };

  handleSaveNotes = () => {
    const { notes, selectedSprint } = this.state;
    updateNotes(notes, selectedSprint.id);
    this.props.update(notes);
  };

  handleShowNotes = id => {
    const { showNoteList } = this.state;
    showNoteList[id] = !showNoteList[id];
    this.setState({
      showNoteList
    });
  };

  renderTextArea = () => {
    return (
      <TextArea
        onChange={this.handleNotes}
        style={{ minHeight: 150 }}
        placeholder="Sprint notes..."
        value={this.state.notes}
      />
    );
  };

  renderName = (name, id) => (
    <div>
      {name}
      <a href={`/issue/${id}`}>
        <Icon className="super" name="plus" size="small" />
      </a>
    </div>
  );

  renderIssue = issue => {
    const {
      name,
      id,
      status,
      time_spent,
      time_estimate,
      time_remaining,
      project_id,
      blocked,
      notes
    } = issue;

    return (
      <Table.Body>
        <Table.Row key={id}>
          <Table.Cell onClick={() => this.handleShowNotes(id)} collapsing>
            {this.renderName(name, id)}
          </Table.Cell>
          <Table.Cell onClick={() => this.handleShowNotes(id)} collapsing>
            {this.mapProjectId(project_id)}
          </Table.Cell>
          <Table.Cell collapsing>
            <Status issueId={id} blocked={blocked === "true"} status={status} />
          </Table.Cell>
          <Table.Cell textAlign="center" collapsing>
            <TimeCounter
              issueId={id}
              inc={true}
              stat="time_spent"
              time={time_spent}
            />
          </Table.Cell>
          <Table.Cell textAlign="center" collapsing>
            <TimeCounter
              issueId={id}
              inc={false}
              stat="time_remaining"
              time={time_remaining}
            />
          </Table.Cell>
          <Table.Cell
            onClick={() => this.handleShowNotes(id)}
            textAlign="center"
            collapsing
          >
            {time_estimate}
          </Table.Cell>
        </Table.Row>
        {this.state.showNoteList[id] && (
          <Table.Row>
            <Table.Cell colSpan="6">
              <label className="bold">Notes: </label>
              <div className="linebreak">{notes}</div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    );
  };

  render() {
    const {
      issueList,
      selectedSprint,
      totalTimeSpent,
      totalTimeRemaining,
      totalTimeEstimate
    } = this.state;

    return (
      <div>
        <Header floated="left" as="h2">
          {selectedSprint && selectedSprint.name}
        </Header>
        <Table sortable celled size="large" compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell onClick={this.handleSort("name")} width={1}>
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                onClick={this.handleSort("project_id")}
                width={1}
              >
                Project
              </Table.HeaderCell>
              <Table.HeaderCell onClick={this.handleSort("status")} width={1}>
                Status
              </Table.HeaderCell>
              <Table.HeaderCell
                onClick={this.handleSort("time_spent")}
                width={1}
              >
                Time Spent
              </Table.HeaderCell>
              <Table.HeaderCell
                onClick={this.handleSort("time_remaining")}
                width={1}
              >
                Time Remaining
              </Table.HeaderCell>
              <Table.HeaderCell
                onClick={this.handleSort("time_estimate")}
                width={1}
              >
                Time Estimate
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {issueList.map(this.renderIssue)}
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan="3" />
              <Table.HeaderCell textAlign="center" colSpan="1">
                {totalTimeSpent}
                {" hours"}
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" colSpan="1">
                {totalTimeRemaining}
                {" hours"}
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center" colSpan="1">
                {totalTimeEstimate}
                {" hours"}
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Form>
          <Form.Field control={this.renderTextArea} label="Sprint Notes" />
        </Form>
        <br />
        <div>
          <Button floated="left" color="green" onClick={this.handleSaveNotes}>
            Save notes
          </Button>
        </div>
      </div>
    );
  }
}

export default IssueTable;
