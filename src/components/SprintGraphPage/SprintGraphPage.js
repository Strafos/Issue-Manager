import React, { Component } from "react";
import { Header, Grid, Loader } from "semantic-ui-react";

import { getSprint, getTimeLogs } from "../../utils/api/api";
import TimeRemainingGraph from "./Graphs/TimeRemainingGraph";
import TimeRemainingMiniGraph from "./Graphs/TimeRemainingMiniGraph";
import TimeSpentGraph from "./Graphs/TimeSpentGraph";

class SprintGraphPage extends Component {
  state = {
    selectedSprint: null,
    sprints: null
  };

  componentDidMount() {
    getTimeLogs(this.props.match.params.id).then(logs => {
      this.setState({
        timeSpentLogs: logs.filter(log => log.time_stat === "time_spent"),
        timeRemainingLogs: logs.filter(
          log => log.time_stat === "time_remaining"
        )
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { match, sprints } = nextProps;

    const sprintId = match.params.id;
    const selectedSprint = sprints.find(sprint => sprint.id == sprintId);

    this.setState({
      selectedSprint
    });

    getSprint(sprintId).then(issues => {
      this.setState({
        totalTimeEstimate:
          issues.length > 0 &&
          issues.map(i => i.time_estimate).reduce((a, b) => a + b)
      });
    });
  }

  render() {
    const {
      timeRemainingLogs,
      selectedSprint,
      totalTimeEstimate,
      timeSpentLogs
    } = this.state;

    if (
      !timeRemainingLogs ||
      !timeSpentLogs ||
      !totalTimeEstimate ||
      !selectedSprint
    ) {
      return (
        <Loader active inline>
          Loading
        </Loader>
      );
    }

    return (
      <Grid divided="vertically">
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as="h2">Time Spent</Header>
            <TimeSpentGraph logs={timeSpentLogs} sprint={selectedSprint} />
          </Grid.Column>
          <Grid.Column>
            <Header as="h2">Time Remaining</Header>
            <TimeRemainingMiniGraph
              // <TimeRemainingGraph
              logs={timeRemainingLogs}
              sprint={selectedSprint}
              totalTimeEstimate={totalTimeEstimate}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Grid.Column>{"foo"}</Grid.Column>
          <Grid.Column>{"bar"}</Grid.Column>
          <Grid.Column>{"baz"}</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SprintGraphPage;
