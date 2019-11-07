import _ from "lodash";
import React, { Component } from "react";

import {
  Icon,
  Table,
  Loader,
} from "semantic-ui-react";

import Status from "../../../components/Status/Status";
import TimeCounter from "../../../components/TimeCounter/TimeCounter";
import Editor from "../ScratchpadDisplay/components/Editor/Editor";

import { updateIssueNotes, updateShowNotes } from "../../../utils/api";
import { cleanNumber } from "../../../utils/arithUtils";
import "./IssueDisplay.css";

const statusMap = {
  "In queue": 1,
  "In progress": 0,
  "Paused": 2,
  "Done": 3,
};

class IssueDisplay extends Component {
  state = {
    issueList: [],
    showNoteList: {},
    editNoteList: {},
    issueNoteList: {},
    issueStatusList: {},
    totalTimeSpent: 0,
    totalTimeRemaining: 0,
    totalTimeEstimate: 0,
    sortByColumn: null,
    direction: null,
    displayTimelogs: false,
  };

  componentDidMount() {
    const { selectedSprint, issues } = this.props;
    this._loadData(selectedSprint, issues);
  }

  componentDidUpdate(prevProps) {
    const { selectedSprint, issues } = this.props;
    if (
      selectedSprint.id !== prevProps.selectedSprint.id ||
      prevProps.issues !== issues
    ) {
      this._loadData(selectedSprint, issues);
    }
  }

  _loadData = (selectedSprint, issues) => {
    const showNoteList = {};
    const editNoteList = {};
    const issueNoteList = {};
    issues &&
      issues.map(issue => (showNoteList[issue.id] = !!issue.show_notes));
    issues && issues.map(issue => (editNoteList[issue.id] = false));
    issues && issues.map(issue => (issueNoteList[issue.id] = issue.notes));

    // Issues, note toggle array, summing times for footer
    this.setState(
      {
        issueList: issues,
        showNoteList,
        editNoteList,
        issueNoteList,
        totalTimeEstimate: issues
          ? issues.map(i => i.time_estimate).reduce((a, b) => a + b, 0)
          : 0,
        totalTimeSpent: issues
          ? issues
            .filter(i => !i.bad)
            .map(i => i.time_spent)
            .reduce((a, b) => a + b, 0)
          : 0,
        totalTimeRemaining: issues
          ? issues.map(i => i.time_remaining).reduce((a, b) => a + b, 0)
          : 0,
      },
      this.handleStatusSort
    );
  };

  handleTimeTotals = (timeStat, delta) => {
    if (timeStat === "time_spent") {
      this.setState({
        totalTimeSpent: cleanNumber(this.state.totalTimeSpent + delta),
      });
    } else if (timeStat === "time_remaining") {
      this.setState({
        totalTimeRemaining: cleanNumber(this.state.totalTimeRemaining + delta),
      });
    } else if (timeStat === "time_estimate") {
      this.setState({
        totalTimeEstimate: cleanNumber(this.state.totalTimeEstimate + delta),
      });
    }
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

  handleStatusSort = () => {
    const { issueList } = this.state;
    this.setState({
      issueList:
        issueList &&
        issueList.sort((a, b) => statusMap[a.status] - statusMap[b.status]),
      direction: "ascending",
      sortByColumn: "status",
    });
  };

  updateStatus = (id, status) => {
    const { issueList } = this.state;
    const idx = issueList.findIndex(issue => issue.id === id);
    issueList[idx].status = status;
    this.setState({
      issueList,
    });
    this.handleStatusSort();
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
          direction: "ascending",
        });
        return;
      }

      if (clickedColumn === "project_id") {
        this.setState({
          sortByColumn: clickedColumn,
          issueList: _.orderBy(
            issueList,
            [user => this.mapProjectId(user.project_id)],
            ["desc"]
          ),
        });
        return;
      }

      this.setState({
        sortByColumn: clickedColumn,
        issueList: _.orderBy(
          issueList,
          [user => user.name.toLowerCase()],
          ["asc"]
        ),
        direction: "descending",
      });

      return;
    }

    this.setState({
      issueList: issueList.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  handleIssueNotes = (id, value) => {
    const { issueNoteList } = this.state;
    issueNoteList[id] = value;
    this.setState({
      issueNoteList,
    });
  };

  handleShowNotes = id => {
    const { showNoteList } = this.state;
    showNoteList[id] = !showNoteList[id];
    this.setState({
      showNoteList,
    });
    updateShowNotes(id, showNoteList[id] ? 1 : 0);
  };

  handleEditNotes = id => {
    const { editNoteList } = this.state;
    editNoteList[id] = !editNoteList[id];
    this.setState({
      editNoteList,
    });
  };

  handleSaveIssueNotes = (id, notes) => {
    const { issueNoteList } = this.state;
    issueNoteList[id] = notes;
    this.setState({ issueNoteList })
    updateIssueNotes(id, notes)
  };

  // I can display quill content as html, but first, I need to do some parsing
  // to get all the new lines/paragraphs to look the right way
  unquill = (text) => {
    text = text.replace(new RegExp("</p><p><br /></p><p>", 'g'), "eibkdjlfbasdf");
    text = text.replace(new RegExp("</p><p><br></p><p>", 'g'), "eibkdjlfbasdf");
    text = text.replace(new RegExp("</p><p>", 'g'), "\n");
    text = text.replace(new RegExp("eibkdjlfbasdf", 'g'), "</p><p>");
    // For empty notes
    if (text === "<p></p>") {
      text = "<p><br></p>"
      // text = "<p>Issue Notes...</p>"
    }
    return text;
  }

  renderName = (name, id) => (
    <div>
      <a href={`/issue/${id}`} style={{ color: "#888" }}>
        {name}
        <Icon color="red" className="super" name="plus" size="small" />
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
      bad,
    } = issue;

    return (
      <Table.Body key={id}>
        <Table.Row>
          <Table.Cell onClick={() => this.handleShowNotes(id)} collapsing>
            {this.renderName(name, id)}
          </Table.Cell>
          <Table.Cell onClick={() => this.handleShowNotes(id)} collapsing>
            {this.mapProjectId(project_id)}
          </Table.Cell>
          <Table.Cell collapsing>
            <Status
              update={this.updateStatus}
              error={this.props.error}
              issueId={id}
              blocked={blocked === "true"}
              status={status}
            />
          </Table.Cell>
          <Table.Cell textAlign="center" collapsing>
            <TimeCounter
              timeTotals={this.handleTimeTotals}
              issueId={id}
              inc={true}
              stat="time_spent"
              time={time_spent}
              bad={bad}
            />
          </Table.Cell>
          <Table.Cell textAlign="center" collapsing>
            <TimeCounter
              timeTotals={this.handleTimeTotals}
              issueId={id}
              inc={false}
              stat="time_remaining"
              time={time_remaining}
              bad={0}
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
              {this.state.editNoteList[id] ? (
                <Editor
                  type="IssueNotes"
                  autoFocus
                  onSave={this.handleSaveIssueNotes}
                  callback={this.handleEditNotes}
                  autoSize
                  id={id}
                  content={this.state.issueNoteList[id]}
                />) :
                <div
                  onClick={() => this.handleEditNotes(id)}
                  style={{ "whiteSpace": "pre-line" }}
                  // Yes I understand this is literally running HTML from text input
                  // But this stuff is self hosted so who cares?
                  dangerouslySetInnerHTML={{ __html: this.unquill(this.state.issueNoteList[id]) }}
                />
              }
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    );
  };

  render() {
    const { selectedSprint } = this.props;
    const {
      issueList,
      totalTimeSpent,
      totalTimeRemaining,
      totalTimeEstimate,
    } = this.state;

    if (!selectedSprint || !issueList) {
      return <Loader active inline />;
    }

    if (issueList.length === 0) {
      return <div />;
    }

    return (
      <Table sortable fixed celled size="large" compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell onClick={this.handleSort("name")} width={4}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell onClick={this.handleSort("project_id")} width={3}>
              Project
            </Table.HeaderCell>
            <Table.HeaderCell onClick={this.handleSort("status")} width={6}>
              Status
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={this.handleSort("time_spent")}
              width={2}
              textAlign="center"
            >
              Time Spent
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={this.handleSort("time_remaining")}
              width={2}
            >
              Time Remaining
            </Table.HeaderCell>
            <Table.HeaderCell
              onClick={this.handleSort("time_estimate")}
              width={2}
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
    );
  }
}

export default IssueDisplay;
