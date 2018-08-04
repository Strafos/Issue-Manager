import React, { Component } from "react";
import { Chart, Lines, Points, Text } from "orama";
import {
  Icon,
  Button,
  Form,
  TextArea,
  Table,
  Header,
  Progress,
  Segment,
  Loader
} from "semantic-ui-react";

import { getSprint, getTimeLogs } from "../../utils/api/api";

class SprintGraphPage extends Component {
  state = {
    selectedSprint: null,
    sprints: null
  };

  mapProjectId = id => {
    const { projects } = this.props;
    const project = projects.find(proj => proj.id === id);
    return project ? project.name : "";
  };

  mapSprintId = id => {
    const { sprints } = this.props;
    const sprint = sprints.find(spr => spr.id === id);
    return sprint;
  };

  componentDidMount() {
    getTimeLogs(this.props.match.params.id).then(logs => {
      console.log(logs);
      this.setState(
        {
          timeSpentLogs: logs.filter(log => log.time_stat === "time_spent"),
          timeRemainingLogs: logs.filter(
            log => log.time_stat === "time_remaining"
          )
        },
        this.constructTimeSpent
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    const { match, sprints } = nextProps;

    const sprintId = match.params.id;
    const selectedSprint = sprints.find(sprint => sprint.id == sprintId);

    this.setState(
      {
        selectedSprint
      },
      this.constructProjectedTimeSpent
    );

    getSprint(sprintId).then(issues => {
      this.setState(
        {
          totalTimeEstimate:
            issues.length > 0 &&
            issues.map(i => i.time_estimate).reduce((a, b) => a + b),
          totalTimeSpent:
            issues.length > 0 &&
            issues
              .filter(i => !i.bad)
              .map(i => i.time_spent)
              .reduce((a, b) => a + b),
          totalTimeRemaining:
            issues.length > 0 &&
            issues.map(i => i.time_remaining).reduce((a, b) => a + b)
        },
        () => {
          this.constructProjectedTimeRemaining();
          this.constructTimeRemaining();
        }
      );
    });
  }

  getDefaultSprint = sprints => {
    const d = new Date();
    if (d.getDay() !== 1) {
      // Get last monday unless today is Monday
      d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7) - 7);
    }

    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    const lastMonday = d.toLocaleDateString("en-US", options);
    return sprints.find(sprint => sprint.start_date === lastMonday);
  };

  constructTimeSpent = () => {
    const { timeSpentLogs } = this.state;
    console.log(timeSpentLogs);

    const timeSpentData = [];
    let total = 0;
    timeSpentLogs.forEach(log => {
      total = total + log.time_delta;
      const timestamp = new Date(log.created_at);
      timestamp.setHours(timestamp.getHours() - 4);
      timeSpentData.push({
        date: timestamp,
        hours: total,
        name: "actual"
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
      0: 0,
      1: 5,
      2: 10,
      3: 15,
      4: 20,
      5: 25,
      6: 35
    };

    const projection = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate.getTime());
      day.setDate(startDate.getDate() + i);
      day.setHours(startDate.getHours() - 4);
      projection.push({
        date: day,
        hours: dateMap[day.getDay()],
        name: "projection"
      });
    }
    const nextMonday = new Date(startDate.getTime());
    nextMonday.setDate(startDate.getDate() + 7);
    nextMonday.setHours(startDate.getHours() - 4);
    projection.push({
      date: nextMonday,
      hours: 45,
      name: "projection"
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
    day.setHours(startDate.getHours() - 4);
    timeRemainingData.push({
      date: day,
      hours: totalTimeEstimate
    });

    let total = totalTimeEstimate;
    timeRemainingLogs.forEach(log => {
      total = total + log.time_delta;
      const timestamp = new Date(log.created_at);
      timestamp.setHours(timestamp.getHours() - 4);
      timeRemainingData.push({ date: timestamp, hours: total });
    });

    this.setState({
      timeRemainingData
    });
  };

  constructProjectedTimeRemaining = () => {
    const { selectedSprint, totalTimeEstimate } = this.state;
    const startDate = new Date(selectedSprint.start_date);
    const dateMap = {
      0: 1,
      1: 8 / 9,
      2: 7 / 9,
      3: 6 / 9,
      4: 5 / 9,
      5: 4 / 9,
      6: 2 / 9
    };

    const projection = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate.getTime());
      day.setDate(startDate.getDate() + i);
      day.setHours(startDate.getHours() - 4);
      projection.push({
        date: day,
        hours: totalTimeEstimate * dateMap[day.getDay()],
        name: "projection"
      });
    }
    const nextMonday = new Date(startDate.getTime());
    nextMonday.setDate(startDate.getDate() + 7);
    nextMonday.setHours(startDate.getHours() - 4);
    projection.push({
      date: nextMonday,
      hours: 0,
      name: "projection"
    });

    this.setState({
      timeRemainingProjection: projection
    });
  };

  render() {
    const {
      timeSpentProjection,
      timeSpentData,
      timeRemainingProjection,
      timeRemainingData
    } = this.state;

    if (!timeSpentProjection || !timeRemainingData) {
      return (
        <Segment>
          <Loader />
        </Segment>
      );
    }
    console.log(timeRemainingData);

    const theme = {
      textFill: "white",
      backgroundFill: "black",
      plotBackgroundFill: "hsl(0, 0%, 20%)",
      guideStroke: "hsl(0, 0%, 30%)",
      guideZeroStroke: "hsl(0, 0%, 55%)",
      plotFill: "white"
    };

    const timeSpent = [timeSpentProjection, timeSpentData];

    return (
      <div>
        <Chart theme={theme}>
          {/* <Lines data={timeSpentProjection} x="date" y="hours" />
          <Lines data={timeSpentData} x="date" y="hours" /> */}
          <Lines data={timeSpent} x="date" y="hours" stroke="name" />
        </Chart>
        <Chart theme={theme}>
          <Lines data={timeRemainingProjection} x="date" y="hours" />
          <Lines data={timeRemainingData} x="date" y="hours" />
        </Chart>
      </div>
    );
  }
}

export default SprintGraphPage;
