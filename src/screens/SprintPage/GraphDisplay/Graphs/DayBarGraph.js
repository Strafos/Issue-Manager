import React, { PureComponent } from "react";
import { Loader } from "semantic-ui-react";

import "./DayBarGraph.css";

import { XAxis, YAxis, XYPlot, HorizontalBarSeries } from "react-vis";

class DayBarGraph extends PureComponent {
  state = {
    timeSpentData: null,
    timeSpentProjection: null,
    hoveredNode: null,
  };

  componentDidMount() {
    const { issues, logs, day } = this.props;
    if (issues && logs) {
      this.constructTimeSpent(logs, issues, day);
    }
  }

  componentDidUpdate(prevProps) {
    const { issues, logs, day } = this.props;
    if (logs !== prevProps.logs || issues !== prevProps.issues) {
      this.constructTimeSpent(logs, issues, day);
    }
  }

  // Thought 1 am is technically the next day, we want to bucket with the previous day
  // By offsetting 3 hours, up until 3am counts to previous day
  getDayWithOffset = created_at => {
    const d = new Date(created_at);

    d.setHours(d.getHours() - 3);
    return d.getDay();
  };

  constructTimeSpent = (logs, issues, day) => {
    const timeSpentMap = {};

    logs
      .filter(log => this.getDayWithOffset(log.created_at) === day % 7)
      .forEach(log => {
        if (timeSpentMap[log.issue_id]) {
          timeSpentMap[log.issue_id] =
            timeSpentMap[log.issue_id] + parseFloat(log.time_delta, 10);
        } else {
          timeSpentMap[log.issue_id] = parseFloat(log.time_delta, 10);
        }
      });

    const timeSpentData = [];
    Object.keys(timeSpentMap).forEach(key => {
      const mappedIssue = issues.find(
        issue => issue.id === parseFloat(key, 10)
      );
      mappedIssue &&
        timeSpentData.push({ y: mappedIssue.name, x: timeSpentMap[key] });
    });

    this.setState({
      timeSpentData,
    });
  };

  render() {
    const { timeSpentData } = this.state;

    if (!timeSpentData) {
      return (
        <Loader active inline>
          Loading
        </Loader>
      );
    }

    return (
      <div>
        <XYPlot
          width={400}
          height={55 + 25 * timeSpentData.length}
          yType={"ordinal"}
          margin={{ left: 150 }}
        >
          <XAxis />
          <YAxis />
          <HorizontalBarSeries color="grey" data={timeSpentData} />
        </XYPlot>
      </div>
    );
  }
}

export default DayBarGraph;
