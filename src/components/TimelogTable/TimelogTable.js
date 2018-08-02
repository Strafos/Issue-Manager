import React, { Component } from "react";
import { Table } from "semantic-ui-react";

import { getTimeLogs } from "../../utils/api/api";

class SprintTable extends Component {
  state = {
    logs: [],
  };

  componentDidMount() {
    const { sprintId } = this.props;
    console.log(sprintId);
    getTimeLogs(sprintId).then(logs => {
      this.setState({
        logs,
      });
    });
  }

  renderLog = log => {
    const { id, time_delta, time_stat, name } = log;
    return (
      <Table.Row key={id}>
        <Table.Cell collapsing>{name}</Table.Cell>
        <Table.Cell collapsing>{time_delta}</Table.Cell>
        <Table.Cell collapsing>{time_stat}</Table.Cell>
      </Table.Row>
    );
  };

  render() {
    const { logs } = this.state;
    console.log(logs);
    return (
      <Table sortable fixed celled size="large" compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Issue</Table.HeaderCell>
            <Table.HeaderCell>Time Delta</Table.HeaderCell>
            <Table.HeaderCell>Time Stat</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{logs.map(this.renderLog)}</Table.Body>
      </Table>
    );
  }
}

export default SprintTable;
