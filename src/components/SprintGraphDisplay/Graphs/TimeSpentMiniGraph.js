import React, { Component } from "react";
import { Segment, Loader, Dimmer } from "semantic-ui-react";

import { XYPlot, Hint, LineMarkSeries } from "react-vis";

class TimeSpentMiniGraph extends Component {
  state = {
    timeSpentData: null,
    timeSpentProjection: null,
    hoveredNode: null
  };

  componentDidMount() {
    const { sprint, logs } = this.props;
    if (sprint && logs) {
      this.constructTimeSpent(sprint, logs);
      this.constructProjectedTimeSpent(sprint);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { sprint, logs } = nextProps;
    if (sprint && logs) {
      this.constructTimeSpent(sprint, logs);
      this.constructProjectedTimeSpent(sprint);
    }
  }

  constructTimeSpent = (sprint, logs) => {
    const startDate = new Date(sprint.start_date);

    const timeSpentData = [{ x: startDate, y: 0 }];

    let total = 0;
    logs.forEach(log => {
      total = total + log.time_delta;
      const timestamp = new Date(log.created_at);
      timeSpentData.push({
        x: timestamp,
        y: total
      });
    });

    this.setState({
      timeSpentData
    });
  };

  constructProjectedTimeSpent = sprint => {
    const startDate = new Date(sprint.start_date);
    const dateMap = {
      0: 35,
      1: 0,
      2: 5,
      3: 10,
      4: 15,
      5: 20,
      6: 25
    };

    const projection = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate.getTime());
      day.setDate(startDate.getDate() + i);
      projection.push({
        x: day,
        y: dateMap[day.getDay()]
      });
    }
    const nextMonday = new Date(startDate.getTime());
    nextMonday.setDate(startDate.getDate() + 7);
    projection.push({
      x: nextMonday,
      y: 45
    });

    this.setState({
      timeSpentProjection: projection
    });
  };

  render() {
    const { timeSpentProjection, timeSpentData, hoveredNode } = this.state;

    if (!timeSpentProjection || !timeSpentData) {
      return (
        <Loader active inline>
          Loading
        </Loader>
      );
    }

    const lastPoint = timeSpentData[timeSpentData.length - 1];

    return (
      <div>
        <XYPlot width={275} height={225}>
          <LineMarkSeries
            color="white"
            size="3"
            onValueMouseOver={hoveredNode => this.setState({ hoveredNode })}
            onValueMouseOut={() => this.setState({ hoveredNode: null })}
            data={timeSpentProjection}
          />
          <LineMarkSeries
            color="red"
            size="1"
            onValueMouseOver={hoveredNode => this.setState({ hoveredNode })}
            onValueMouseOut={() => this.setState({ hoveredNode: null })}
            data={timeSpentData}
          />

          {!hoveredNode ? (
            <Hint
              align={{ vertical: "top", horizontal: "left" }}
              value={lastPoint}
            >
              <div
                style={{
                  background: "black",
                  textAlign: "left",
                  padding: "5px",
                  borderRadius: "5px"
                }}
              >
                <p>{"Hours Spent: " + Math.round(lastPoint.y)}</p>
                {"Time: " +
                  lastPoint.x.toLocaleTimeString() +
                  " on " +
                  lastPoint.x.toDateString()}
              </div>
            </Hint>
          ) : null}

          {hoveredNode ? (
            <Hint value={hoveredNode}>
              <div
                style={{
                  background: "black",
                  textAlign: "left",
                  padding: "5px",
                  borderRadius: "5px"
                }}
              >
                <p>{"Hours: " + hoveredNode.y}</p>
                {"Time: " +
                  hoveredNode.x.toLocaleTimeString() +
                  " on " +
                  hoveredNode.x.toDateString()}
              </div>
            </Hint>
          ) : null}
        </XYPlot>
      </div>
    );
  }
}

export default TimeSpentMiniGraph;
