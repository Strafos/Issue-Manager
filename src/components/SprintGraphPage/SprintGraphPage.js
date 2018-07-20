import React, { Component } from "react";
import { Header, Button, Loader } from "semantic-ui-react";

import { getSprint, getTimeLogs } from "../../utils/api/api";
import TimeRemainingGraph from "./Graphs/TimeRemainingGraph";
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

    console.log(totalTimeEstimate);
    console.log(selectedSprint);
    console.log(timeRemainingLogs);

    if (
      !timeRemainingLogs ||
      !timeSpentLogs ||
      !totalTimeEstimate ||
      !selectedSprint
    ) {
      return <Button content="WTF?" />;
    }

    console.log(timeRemainingLogs);
    console.log(selectedSprint);
    console.log(totalTimeEstimate);

    return (
      <div>
        <TimeRemainingGraph
          logs={timeRemainingLogs}
          sprint={selectedSprint}
          totalTimeEstimate={totalTimeEstimate}
        />
        <TimeSpentGraph logs={timeSpentLogs} sprint={selectedSprint} />
      </div>
    );
  }
}

export default SprintGraphPage;
