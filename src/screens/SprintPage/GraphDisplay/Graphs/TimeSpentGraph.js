import React, { Component } from "react";
import { Loader } from "semantic-ui-react";
import { connect } from "react-redux";
import { XYPlot, XAxis, YAxis, Hint, LineMarkSeries } from "react-vis";

import { cleanNumber } from "../../../../utils/arithUtils";
import { dayDiff, isWeekend } from "../../../../utils/dateUtils";

class TimeSpentGraph extends Component {
  state = {
    timeSpentData: null,
    timeSpentProjection: null,
    hoveredNode: null,
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
    this.constructTimeSpent(sprint, logs);
    this.constructProjectedTimeSpent(sprint);
  }

  constructTimeSpent = (sprint, logs) => {
    const startDate = new Date(sprint.start_date);

    const timeSpentData = [];
    logs.length > 0 && timeSpentData.push({ x: startDate, y: 0 });

    let total = 0;
    logs.forEach(log => {
      total = total + log.time_delta;
      const timestamp = new Date(log.created_at);
      timeSpentData.push({
        x: timestamp,
        y: cleanNumber(total),
      });
    });

    this.setState({
      timeSpentData,
    });
  };

  constructProjectedTimeSpent = sprint => {
    const { weekdayHours, weekendHours } = this.props;
    const startDate = new Date(sprint.start_date);
    const endDate = new Date(sprint.end_date);

    const projection = [];
    let time = 0;
    for (let i = 0; i < dayDiff(startDate, endDate) + 1; i++) {
      const day = new Date(startDate.getTime());
      day.setDate(startDate.getDate() + i);

      projection.push({
        x: day,
        y: time,
      });

      time += isWeekend(day) ? weekendHours : weekdayHours;
    }

    this.setState({
      timeSpentProjection: projection,
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

    return (
      <div>
        <XYPlot width={600} height={400}>
          <XAxis xType="time" position="start" tickTotal={7} />
          <YAxis tickTotal={10} />
          <LineMarkSeries
            color="white"
            onValueMouseOver={hoveredNode => this.setState({ hoveredNode })}
            onValueMouseOut={() => this.setState({ hoveredNode: null })}
            data={timeSpentProjection}
          />
          <LineMarkSeries
            color="red"
            size={3}
            onValueMouseOver={hoveredNode => this.setState({ hoveredNode })}
            onValueMouseOut={() => this.setState({ hoveredNode: null })}
            data={timeSpentData}
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
)(TimeSpentGraph);
