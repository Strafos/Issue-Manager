import React, { PureComponent } from "react";
import { Header, Grid, Divider, Loader } from "semantic-ui-react";

import { getTimeLogs } from "../../../utils/api";
import TimeRemainingGraph from "./Graphs/TimeRemainingGraph";
import TimeSpentGraph from "./Graphs/TimeSpentGraph";
import DayBarGraph from "./Graphs/DayBarGraph";

// Shows the progress of the sprint through two main graphs
// TimeRemaining and Time Spent
// Also has a small bar graph for time spent on issue per day
class SprintGraphDisplay extends PureComponent {
  state = {
    selectedSprint: null,
    sprints: null,
  };

  componentDidMount() {
    const { selectedSprint, issueList } = this.props;
    this._loadData(selectedSprint, issueList);
  }

  componentDidUpdate(prevProps) {
    const { selectedSprint, issueList } = this.props;
    if (selectedSprint.id !== prevProps.selectedSprint.id) {
      this._loadData(selectedSprint, issueList);
    }
  }

  _loadData = (selectedSprint, issueList) => {
    const sprintId = selectedSprint.id;

    // Use the id from URL to get all timelogs
    getTimeLogs(sprintId).then(logs => {
      this.setState({
        timeSpentLogs: logs.filter(log => log.time_stat === "time_spent"),
        timeRemainingLogs: logs.filter(
          log => log.time_stat === "time_remaining"
        ),
      });
    });

    this.setState({
      selectedSprint,
    });

    this.setState({
      totalTimeEstimate:
        issueList && issueList.length > 0
          ? issueList.map(i => i.time_estimate).reduce((a, b) => a + b, 0)
          : 0,
      issueList,
    });
  };

  render() {
    const {
      timeRemainingLogs,
      totalTimeEstimate,
      timeSpentLogs,
      issueList,
    } = this.state;
    const { selectedSprint } = this.props;

    if (!timeRemainingLogs || !timeSpentLogs || !selectedSprint) {
      return (
        <Loader active inline>
          Loading
        </Loader>
      );
    }

    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as="h2">Time Spent</Header>
            <TimeSpentGraph logs={timeSpentLogs} sprint={selectedSprint} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h2">Time Remaining</Header>
            <TimeRemainingGraph
              logs={timeRemainingLogs}
              sprint={selectedSprint}
              totalTimeEstimate={totalTimeEstimate}
            />
          </Grid.Column>
        </Grid.Row>
        <Divider />

        <Grid.Row columns={3}>
          <Grid.Column>
            <Header as="h2">Monday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={1} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h2">Tuesday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={2} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h2">Wednesday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={3} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column>
            <Header as="h2">Thursday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={4} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h2">Friday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={5} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h2">Saturday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={6} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column />
          <Grid.Column>
            <Header as="h2">Sunday</Header>
            <DayBarGraph logs={timeSpentLogs} issues={issueList} day={7} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SprintGraphDisplay;
