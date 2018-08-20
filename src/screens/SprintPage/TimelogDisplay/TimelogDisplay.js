import React, { Component } from "react";
import { Button, Table, Header, Icon, Grid } from "semantic-ui-react";
import TimeAgo from "react-timeago";
import { connect } from "react-redux";

import { deleteLog } from "../../../utils/api";
import * as Actions from "../sprintPageActions";

class TimelogDisplay extends Component {
  state = {
    spentLogs: [],
    remainLogs: [],
  };

  componentDidMount() {
    this._parseLogs();
  }

  componentDidUpdate(prevProps) {
    const { sprintId } = this.props;
    if (sprintId !== prevProps.sprintId) {
      this._parseLogs();
    }
  }

  _parseLogs = () => {
    const { timelogs } = this.props;
    const spentLogs = timelogs
      .filter(log => log.time_stat === "time_spent")
      .reverse();
    const remainLogs = timelogs
      .filter(log => log.time_stat === "time_remaining")
      .reverse();
    this.setState({
      spentLogs,
      remainLogs,
    });
  };

  handleDeleteLog = id => {
    const { spentLogs, remainLogs } = this.state;
    deleteLog(id);
    this.setState({
      spentLogs: spentLogs.filter(log => log.id !== id),
      remainLogs: remainLogs.filter(log => log.id !== id),
    });
  };

  renderLog = log => {
    const { id, time_delta, name, created_at, total } = log;
    return (
      <Table.Row key={id}>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell textAlign="center">
          <TimeAgo date={created_at} />
        </Table.Cell>
        <Table.Cell textAlign="center">{total}</Table.Cell>
        <Table.Cell textAlign="center">{time_delta}</Table.Cell>
        <Table.Cell textAlign="center">
          {new Date(created_at).toLocaleString()}
        </Table.Cell>
        <Table.Cell textAlign="center">
          <Button onClick={() => this.handleDeleteLog(id)} icon>
            <Icon name="trash" />
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  };

  renderTable = logs => (
    <Table celled compact fixed size="large">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={4}>Issue</Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={4}>
            Created
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            Total
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            Delta
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={6}>
            Date
          </Table.HeaderCell>
          <Table.HeaderCell textAlign="center" width={2}>
            Delete
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{logs.map(this.renderLog)}</Table.Body>
    </Table>
  );

  render() {
    const { spentLogs, remainLogs } = this.state;

    return (
      <Grid divided columns={2}>
        <Grid.Column>
          <Header as="h3">Time Spent</Header>
          {this.renderTable(spentLogs)}
        </Grid.Column>
        <Grid.Column>
          <Header as="h3">Time Remaining</Header>
          {this.renderTable(remainLogs)}
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  timelogs: state.sprintPage.timelogList.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelogDisplay);
