import React, { Component } from "react";
import { Segment, Loader, Dimmer } from "semantic-ui-react";

import {
  XAxis,
  YAxis,
  XYPlot,
  HorizontalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  Hint,
  LineMarkSeries
} from "react-vis";

class DayBarGraph extends Component {
  state = {
    timeSpentData: null,
    timeSpentProjection: null,
    hoveredNode: null
  };

  componentDidMount() {
    const { issues, logs, day } = this.props;
    if (issues && logs) {
      this.constructTimeSpent(logs, issues, day);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { issues, logs, day } = nextProps;
    this.constructTimeSpent(logs, issues, day);
  }

  constructTimeSpent = (logs, issues, day) => {
    const timeSpentMap = {};

    logs
      .filter(log => new Date(log.created_at).getDay() === day)
      .forEach(log => {
        if (timeSpentMap[log.issue_id]) {
          timeSpentMap[log.issue_id] =
            timeSpentMap[log.issue_id] + parseInt(log.time_delta, 10);
        } else {
          timeSpentMap[log.issue_id] = parseInt(log.time_delta, 10);
        }
      });

    const timeSpentData = [];
    Object.keys(timeSpentMap).forEach(key => {
      const issueName = issues.find(issue => issue.id === parseInt(key, 10))
        .name;
      timeSpentData.push({ y: issueName, x: timeSpentMap[key] });
    });

    this.setState({
      timeSpentData
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

    console.log(timeSpentData);

    return (
      <div>
        <XYPlot
          width={400}
          height={80 * timeSpentData.length}
          yType={"ordinal"}
          margin={{ left: 150 }}
        >
          <XAxis />
          <YAxis />
          <HorizontalBarSeries data={timeSpentData} />
        </XYPlot>
      </div>
    );
  }
}

export default DayBarGraph;
