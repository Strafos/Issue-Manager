import React, { Component } from "react";
import { Segment, Loader } from "semantic-ui-react";

import { XYPlot, XAxis, YAxis, Hint, LineMarkSeries } from "react-vis";

import { getSprint, getTimeLogs } from "../../utils/api/api";

class TimeRemainingGraph extends Component {
  constructTimeSpent = () => {
    const { timeSpentLogs, selectedSprint } = this.state;
    const startDate = new Date(selectedSprint.start_date);

    const timeSpentData = [{ x: startDate, y: 0 }];

    let total = 0;
    timeSpentLogs.forEach(log => {
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

  constructProjectedTimeSpent = () => {
    const { selectedSprint } = this.state;
    const startDate = new Date(selectedSprint.start_date);
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

  constructTimeRemaining = () => {
    const { timeRemainingLogs, selectedSprint, totalTimeEstimate } = this.state;
    const timeRemainingData = [];

    const startDate = new Date(selectedSprint.start_date);
    const day = new Date(startDate.getTime());
    day.setDate(startDate.getDate());
    timeRemainingData.push({
      x: day,
      y: totalTimeEstimate
    });

    let total = totalTimeEstimate;
    timeRemainingLogs.forEach(log => {
      total = total + log.time_delta;
      const timestamp = new Date(log.created_at);
      timeRemainingData.push({ x: timestamp, y: total });
    });

    this.setState({
      timeRemainingData
    });
  };

  constructProjectedTimeRemaining = () => {
    const { selectedSprint, totalTimeEstimate } = this.state;
    const startDate = new Date(selectedSprint.start_date);
    const dateMap = {
      1: 1,
      2: 8 / 9,
      3: 7 / 9,
      4: 6 / 9,
      5: 5 / 9,
      6: 4 / 9,
      0: 2 / 9
    };

    const projection = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate.getTime());
      day.setDate(startDate.getDate() + i);
      projection.push({
        x: day,
        y: totalTimeEstimate * dateMap[day.getDay()]
      });
    }
    const nextMonday = new Date(startDate.getTime());
    nextMonday.setDate(startDate.getDate() + 7);
    projection.push({
      x: nextMonday,
      y: 0
    });

    this.setState({
      timeRemainingProjection: projection
    });
  };

  render() {
    const {
      timeSpentProjection,
      timeSpentData,
      value,
      timeRemainingProjection,
      timeRemainingData
    } = this.state;

    if (!timeSpentProjection) {
      return (
        <Segment>
          <Loader />
        </Segment>
      );
    }

    return (
      <div>
        <XYPlot width={600} height={400}>
          <XAxis xType="time" position="start" tickTotal={7} />
          <YAxis tickTotal={10} />
          <LineMarkSeries
            color="white"
            onValueMouseOver={value => this.setState({ value })}
            onValueMouseOut={() => this.setState({ value: null })}
            data={timeSpentProjection}
          />
          <LineMarkSeries
            color="red"
            size={3}
            onValueMouseOver={value => this.setState({ value })}
            onValueMouseOut={() => this.setState({ value: null })}
            data={timeSpentData}
          />
          {value ? (
            <Hint value={value}>
              <div
                style={{
                  background: "black",
                  textAlign: "left",
                  padding: "5px",
                  borderRadius: "5px"
                }}
              >
                <p>{"Hours: " + value.y}</p>
                {"Time: " +
                  value.x.toLocaleTimeString() +
                  " on " +
                  value.x.toDateString()}
              </div>
            </Hint>
          ) : null}
        </XYPlot>
        <XYPlot width={600} height={400}>
          <XAxis xType="time" position="start" tickTotal={7} />
          <YAxis tickTotal={10} />
          <LineMarkSeries
            color="white"
            onValueMouseOver={value => this.setState({ value })}
            onValueMouseOut={() => this.setState({ value: null })}
            data={timeRemainingProjection}
          />
          <LineMarkSeries
            color="red"
            size={3}
            onValueMouseOver={value => this.setState({ value })}
            onValueMouseOut={() => this.setState({ value: null })}
            data={timeRemainingData}
          />
          {value ? (
            <Hint value={value}>
              <div
                style={{
                  background: "black",
                  textAlign: "left",
                  padding: "5px",
                  borderRadius: "5px"
                }}
              >
                <p>{"Hours: " + value.y}</p>
                {"Time: " +
                  value.x.toLocaleTimeString() +
                  " on " +
                  value.x.toDateString()}
              </div>
            </Hint>
          ) : null}
        </XYPlot>
      </div>
    );
  }
}

export default TimeRemainingGraph;
