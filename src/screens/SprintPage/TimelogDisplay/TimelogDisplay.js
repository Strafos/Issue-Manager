import React, { Component } from "react";
import { Button, Table, Header, Icon, Grid, Loader } from "semantic-ui-react";
import TimeAgo from "react-timeago";
import { connect } from "react-redux";

import * as Actions from "../sprintPageActions";

class TimelogDisplay extends Component {
  handleDeleteLog = id => {
    this.props.deleteLog(id);
  };

  componentDidMount() {
    const { sprintId } = this.props;
    this.props.getSpentTimeLogs(sprintId);
    this.props.getRemainingTimeLogs(sprintId);
  }

  componentDidUpdate(prevProps) {
    const { sprintId } = this.props;
    if (prevProps.sprintId !== sprintId) {
      this.props.getSpentTimeLogs(sprintId);
      this.props.getRemainingTimeLogs(sprintId);
    }
  }

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
      <Table.Body>
        {logs
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map(this.renderLog)}
      </Table.Body>
    </Table>
  );

  render() {
    const { spentLogs, remainLogs } = this.props;

    if (!spentLogs || !remainLogs) {
      return <Loader active inline />;
    }

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
  spentLogs: state.sprintPage.timeSpentLogList.data,
  remainLogs: state.sprintPage.timeRemainingLogList.data,
});

const mapDispatchToProps = {
  getSpentTimeLogs: Actions.getTimeSpentLogs,
  getRemainingTimeLogs: Actions.getTimeRemainingLogs,
  deleteLog: Actions.deleteLog,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelogDisplay);
