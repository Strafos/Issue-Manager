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
      .filter(log => this.getDayWithOffset(log.created_at) === day)
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
