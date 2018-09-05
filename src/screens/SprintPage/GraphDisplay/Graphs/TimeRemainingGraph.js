import React, { Component } from "react";
import { connect } from "react-redux";
import { Loader } from "semantic-ui-react";
import { XYPlot, XAxis, YAxis, Hint, LineMarkSeries } from "react-vis";

import {
  dayDiff,
  dateRangeHours,
  isWeekend,
} from "../../../../utils/dateUtils";

class TimeRemainingGraph extends Component {
  state = {
    timeRemainingProjection: [], // Projection is expected benchmarks
    timeRemainingData: [], // Data comes from parsed timelogs
    hoveredNode: null, // Hint appears when node is hovered over
  };

  componentDidMount() {
    const { logs, sprint, totalTimeEstimate } = this.props;
    if (logs && sprint) {
      this.constructTimeRemainingData(logs, sprint, totalTimeEstimate);
      this.constructProjectedTimeRemaining(sprint, totalTimeEstimate);
    }
  }

  // totalTimeEstimate is calculated after an async db call for issues
  // using this method is hacky b/c it's deprecated, but at least it works
  // It's annoying to convert this to componentDidUpdate()
  componentWillReceiveProps(nextProps) {
    const { logs, sprint, totalTimeEstimate } = nextProps;
    this.constructTimeRemainingData(logs, sprint, totalTimeEstimate);
    this.constructProjectedTimeRemaining(sprint, totalTimeEstimate);
  }

  // Iterate through time logs to create datapoints for time remaining
  constructTimeRemainingData = (logs, sprint, totalTimeEstimate) => {
    const timeRemainingData = [];

    const startDate = new Date(sprint.start_date);
    const day = new Date(startDate.getTime());
    day.setDate(startDate.getDate());
    totalTimeEstimate &&
      timeRemainingData.push({
        x: day,
        y: totalTimeEstimate,
      });

    let total = totalTimeEstimate;
    logs.forEach(log => {
      total = total + log.time_delta;
      const timestamp = new Date(log.created_at);
      timeRemainingData.push({ x: timestamp, y: total });
    });

    this.setState({
      timeRemainingData,
    });
  };

  constructProjectedTimeRemaining = (sprint, totalTimeEstimate) => {
    const { weekdayHours, weekendHours } = this.props;
    const estimate = totalTimeEstimate || 40;

    const startDate = new Date(sprint.start_date);
    const endDate = new Date(sprint.end_date);

    const totalHours = dateRangeHours(
      new Date(startDate.getTime()),
      new Date(endDate.getTime()),
      weekdayHours,
      weekendHours
    );

    const projection = [];
    let currHours = 0;
    for (let i = 0; i < dayDiff(startDate, endDate) + 1; i++) {
      const day = new Date(startDate.getTime());
      day.setDate(startDate.getDate() + i);

      projection.push({
        x: day,
        y: estimate * (1 - currHours / totalHours),
      });

      currHours += isWeekend(day) ? weekendHours : weekdayHours;
    }

    this.setState({
      timeRemainingProjection: projection,
    });
  };

  render() {
    const {
      hoveredNode,
      timeRemainingProjection,
      timeRemainingData,
    } = this.state;

    if (!timeRemainingData || !timeRemainingProjection) {
      return (
        <Loader active inline>
          Loading
        </Loader>
      );
    }

    return (
      <XYPlot width={600} height={400}>
        <XAxis xType="time" position="start" tickTotal={7} />
        <YAxis tickTotal={10} />
        <LineMarkSeries
          color="white"
          onValueMouseOver={hoveredNode => this.setState({ hoveredNode })}
          onValueMouseOut={() => this.setState({ hoveredNode: null })}
          data={timeRemainingProjection}
        />
        <LineMarkSeries
          color="red"
          size="3"
          onValueMouseOver={hoveredNode => this.setState({ hoveredNode })}
          onValueMouseOut={() => this.setState({ hoveredNode: null })}
          data={timeRemainingData}
        />

        {hoveredNode ? (
          <Hint value={hoveredNode}>
            <div
              style={{
                background: "black",
                textAlign: "left",
                padding: "5px",
                borderRadius: "5px",
              }}
            >
              <p>{"Hours: " + Math.round(hoveredNode.y)}</p>
              {"Time: " +
                hoveredNode.x.toLocaleTimeString() +
                " on " +
                hoveredNode.x.toDateString()}
            </div>
          </Hint>
        ) : null}
      </XYPlot>
    );
  }
}

const mapStateToProps = state => ({
  weekdayHours: state.commonData.settings.data
    ? state.commonData.settings.data.weekdayHours
    : 5,
  weekendHours: state.commonData.settings.data
    ? state.commonData.settings.data.weekendHours
    : 10,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeRemainingGraph);
