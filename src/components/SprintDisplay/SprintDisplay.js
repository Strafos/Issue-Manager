import _ from "lodash";
import React, { Component } from "react";
import "./SprintDisplay.css";
import {
  Icon,
  Grid,
  Button,
  Form,
  TextArea,
  Table,
  Header,
  Progress,
  Container,
  Loader,
  Divider,
} from "semantic-ui-react";

import Status from "../Status/Status";
import TimeCounter from "../TimeCounter/TimeCounter";
import TimelogTable from "../TimelogTable/TimelogTable";

import {
  getSprint,
  updateIssueNotes,
  updateSprintNotes,
  updateShowNotes,
  updateSprintQuote,
} from "../../utils/api/api";

class SprintDisplay extends Component {
  state = {
    selectedSprint: null,
    issueList: [],
    notes: "",
    showNoteList: {},
    editNoteList: {},
    issueNoteList: {},
    issueStatusList: {},
    totalTimeSpent: 0,
    totalTimeRemaining: 0,
    totalTimeEstimate: 0,
    sortByColumn: null,
    direction: null,
    editQuote: false,
    quote: "",
    displayTimelogs: false,
  };

  statusMap = {
    "In queue": 1,
    "In progress": 0,
    Paused: 2,
    Done: 3,
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

  componentDidMount() {
    const { match, sprints } = this.props;

    const defaultSprint = this.getDefaultSprint(sprints);
    const defaultSprintId = defaultSprint ? defaultSprint.id : null;

    // If the id is part of the url params, use that, otherwise, display default sprint
    const id = match.params.id ? match.params.id : defaultSprintId;

    getSprint(id).then(issues => {
      const selectedSprint = sprints.find(spr => spr.id == id);
      const showNoteList = {};
      const editNoteList = {};
      const issueNoteList = {};
      issues.map(issue => (showNoteList[issue.id] = !!issue.show_notes));
      issues.map(issue => (editNoteList[issue.id] = false));
      issues.map(issue => (issueNoteList[issue.id] = issue.notes));

      // Issues, note toggle array, summing times for footer
      this.setState({
        selectedSprint,
        issueList: issues,
        showNoteList,
        editNoteList,
        issueNoteList,
        totalTimeEstimate:
          issues.length > 0 &&
          issues.map(i => i.time_estimate).reduce((a, b) => a + b),
        totalTimeSpent:
          issues.length > 0 &&
          issues
            .filter(i => !i.bad)
            .map(i => i.time_spent)
            .reduce((a, b) => a + b),
        totalTimeRemaining:
          issues.length > 0 &&
          issues.map(i => i.time_remaining).reduce((a, b) => a + b),
      });

      // SPRINT notes
      this.setState({
        notes: selectedSprint ? selectedSprint.notes : "",
        quote: selectedSprint ? selectedSprint.quote : "",
      });

      // Want to sort by status by default
      this.handleStatusSort();
    });
  }

  componentWillReceiveProps(nextProps) {
    const { match, sprints } = nextProps;

    const defaultSprint = this.getDefaultSprint(sprints);
    const defaultSprintId = defaultSprint ? defaultSprint.id : null;

    // If the id is part of the url params, use that, otherwise, display default sprint
    const id = match.params.id ? match.params.id : defaultSprintId;

    getSprint(id).then(issues => {
      const selectedSprint = sprints.find(spr => spr.id == id);
      const showNoteList = {};
      const editNoteList = {};
      const issueNoteList = {};
      issues.map(issue => (showNoteList[issue.id] = !!issue.show_notes));
      issues.map(issue => (editNoteList[issue.id] = false));
      issues.map(issue => (issueNoteList[issue.id] = issue.notes));

      // Issues, note toggle array, summing times for footer
      this.setState({
        selectedSprint,
        issueList: issues,
        showNoteList,
        editNoteList,
        issueNoteList,
        totalTimeEstimate:
          issues.length > 0 &&
          issues.map(i => i.time_estimate).reduce((a, b) => a + b),
        totalTimeSpent:
          issues.length > 0 &&
          issues
            .filter(i => !i.bad)
            .map(i => i.time_spent)
            .reduce((a, b) => a + b),
        totalTimeRemaining:
          issues.length > 0 &&
          issues.map(i => i.time_remaining).reduce((a, b) => a + b),
      });

      // SPRINT notes
      this.setState({
        notes: selectedSprint ? selectedSprint.notes : "",
        quote: selectedSprint ? selectedSprint.quote : "",
      });

      // Want to sort by status by default
      this.handleStatusSort();
    });
  }

  getDefaultSprint = sprints => {
    const d = new Date();
    if (d.getDay() !== 1) {
      // Get last monday unless today is Monday
      d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) - 7);
    }

    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    const lastMonday = d.toLocaleDateString("en-US", options);
    return sprints.find(sprint => sprint.start_date === lastMonday);
  };

  handleTimeTotals = (timeStat, delta) => {
    if (timeStat === "time_spent") {
      this.setState({
        totalTimeSpent: this.state.totalTimeSpent + delta,
      });
    } else if (timeStat === "time_remaining") {
      this.setState({
        totalTimeRemaining: this.state.totalTimeRemaining + delta,
      });
    } else if (timeStat === "time_estimate") {
      this.setState({
        totalTimeEstimate: this.state.totalTimeEstimate + delta,
      });
    }
  };

  handleStatusSort = () => {
    const { issueList } = this.state;
    this.setState({
      issueList: issueList.sort(
        (a, b) => this.statusMap[a.status] - this.statusMap[b.status]
      ),
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
      }

      this.setState({
        sortByColumn: clickedColumn,
        issueList: _.sortBy(issueList, [clickedColumn]),
        direction: "descending",
      });

      return;
    }

    this.setState({
      issueList: issueList.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
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
        direction: "ascending",
      });
    }

    this.setState({
      sortByColumn: sortByColumn,
      issueList: _.sortBy(issueList, [sortByColumn]),
      direction: "descending",
    });
  };

  handleSprintNotes = (event, { value }) => {
    this.setState({
      notes: value,
    });
  };

  handleIssueNotes = (id, value) => {
    const { issueNoteList } = this.state;
    issueNoteList[id] = value;
    this.setState({
      issueNoteList,
    });
  };

  handleSaveSprintNotes = () => {
    const { notes, selectedSprint } = this.state;
    updateSprintNotes(notes, selectedSprint.id).then(res => {
      if (!res || res.status !== "Success") {
        this.props.error("Failed to save notes");
      }
    });
  };

  handleSaveSprintQuote = () => {
    const { quote, selectedSprint } = this.state;
    this.toggleEditSprintQuote();
    updateSprintQuote(quote, selectedSprint.id).then(res => {
      if (!res || res.status !== "Success") {
        this.props.error("Failed to save quote");
      }
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
    this.handleEditNotes(id);
    updateIssueNotes(id, notes);
  };

  handleSprintQuoteChange = (event, { value }) => {
    this.setState({
      quote: value,
    });
  };

  projectedProgress = () => {
    const { selectedSprint } = this.state;
    const now = new Date();
    const sprintEnd = new Date(selectedSprint && selectedSprint.end_date);
    const delta = sprintEnd - now;

    // Sprint has past, so set projected to 100%
    if (delta / 1000 / 3600 / 24 < 0) {
      return 100;
    }

    // 5hrs per weekday, 10 hours per weekend
    const dateMap = {
      1: 5,
      2: 10,
      3: 15,
      4: 20,
      5: 25,
      6: 35,
      0: 45,
    };
    return Math.round((dateMap[new Date().getDay()] / 45) * 100);
  };

  toggleEditSprintQuote = () => {
    this.setState({
      editQuote: !this.state.editQuote,
    });
  };

  renderTextArea = () => {
    return (
      <TextArea
        onChange={this.handleSprintNotes}
        style={{
          minHeight: 150,
          backgroundColor: "#282828",
          color: "#BEBEBE",
          fontSize: 17,
        }}
        placeholder="Sprint notes..."
        value={this.state.notes}
      />
    );
  };

  renderName = (name, id) => (
    <div>
      {name}
      <a href={`/issue/${id}`}>
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
      <Table.Body>
        <Table.Row key={id}>
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
                <Form>
                  <TextArea
                    onChange={(event, { value }) =>
                      this.handleIssueNotes(id, value)
                    }
                    style={{
                      minHeight: 150,
                      backgroundColor: "#282828",
                      color: "#BEBEBE",
                    }}
                    placeholder="Issue notes..."
                    value={this.state.issueNoteList[id]}
                  />
                  <Button
                    floated="left"
                    color="red"
                    onClick={() =>
                      this.handleSaveIssueNotes(
                        id,
                        this.state.issueNoteList[id]
                      )
                    }
                  >
                    Save
                  </Button>
                </Form>
              ) : (
                <div
                  onClick={() => this.handleEditNotes(id)}
                  className="linebreak"
                >
                  {this.state.issueNoteList[id] || "Notes: "}
                </div>
              )}
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
      totalTimeEstimate,
      editQuote,
      quote,
      displayTimelogs,
    } = this.state;

    if (!selectedSprint) {
      return <Loader active inline />;
    }

    return (
      <div>
        <Grid verticalAlign="top" columns={2} stretched>
          <Grid.Column textAlign="left" width={4}>
            <Grid.Row>
              <Header floated="left" as="h1">
                {selectedSprint && selectedSprint.name}
                <Header.Subheader>
                  {editQuote ? (
                    <div>
                      <TextArea
                        onChange={this.handleSprintQuoteChange}
                        defaultValue={quote}
                      />
                      <Button
                        color="black"
                        floated="right"
                        onClick={this.handleSaveSprintQuote}
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <Container onClick={this.toggleEditSprintQuote}>
                      {quote || "you idiot"}
                    </Container>
                  )}
                </Header.Subheader>
              </Header>
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <a href={`/sprint/graph/${selectedSprint.id}`}>
                <Button color="black" floated="left">
                  {"Graphs"}
                </Button>
              </a>
              <Button
                onClick={() =>
                  this.setState({ displayTimelogs: !displayTimelogs })
                }
                color="black"
                floated="left"
              >
                {displayTimelogs ? "Issues" : "TimeLogs"}
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={12}>
            <Container>
              <Progress
                percent={Math.round((totalTimeSpent / 45) * 100)}
                progress
                color="black"
                size="small"
                label="Time Spent"
              />
              <Progress
                percent={Math.round(
                  (1 - totalTimeRemaining / totalTimeEstimate) * 100
                )}
                progress
                color="black"
                label="Task Progress"
                size="small"
              />
              <Progress
                percent={this.projectedProgress()}
                progress
                color="black"
                size="small"
                label="Projected"
              />
            </Container>
          </Grid.Column>
        </Grid>
        {displayTimelogs ? (
          <TimelogTable sprintId={selectedSprint && selectedSprint.id} />
        ) : (
          <Table sortable fixed celled size="large" compact>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell onClick={this.handleSort("name")} width={4}>
                  Name
                </Table.HeaderCell>
                <Table.HeaderCell
                  onClick={this.handleSort("project_id")}
                  width={3}
                >
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
        )}
        {/* <textarea
          className="textArea"
          onChange={this.handleSprintNotes}
          // style={{ minHeight: 150, backgroundColor: "black" }}
          placeholder="Sprint notes..."
          value={this.state.notes}
        /> */}
        <Form>
          <Form.Field control={this.renderTextArea} label="Sprint Notes" />
        </Form>
        <br />
        <div>
          <Button
            floated="left"
            color="red"
            onClick={this.handleSaveSprintNotes}
          >
            Save notes
          </Button>
        </div>
      </div>
    );
  }
}

export default SprintDisplay;
