import React, { Component } from "react";
import { Icon, Grid, Button, Modal, Input, Form } from "semantic-ui-react";
import ReactDatePicker from "react-datepicker";
import { connect } from "react-redux";

import * as CommonActions from "../../../commonActions";

import "./SprintModal.css";

import "react-datepicker/dist/react-datepicker.css";

class SprintModal extends Component {
  state = {
    name: "",
    startDate: null,
    endDate: null,
    modalOpen: false,
  };

  padding = {
    padding: "5px",
    textAlign: "center",
  };

  center = {
    "text-align": "center",
  };

  handleOpen = () =>
    this.setState({
      modalOpen: true,
    });

  handleClose = event => {
    this.setState({
      modalOpen: event instanceof MouseEvent ? true : false,
    });
  };

  handleValidate = () => {
    const { name, startDate, endDate } = this.state;
    return name.length === 0 || startDate === null || endDate === null;
  };

  handleChangeStartDate = (date, foo) => {
    this.setState({
      startDate: date,
    });
  };

  handleChangeEndDate = date => {
    this.setState({
      endDate: date,
    });
  };

  handleName = (event, { value }) => {
    this.setState({
      name: value,
    });
  };

  handleSubmit = () => {
    const { startDate, endDate, name } = this.state;
    const requestObj = {
      name,
      startDate: startDate.format("MM/DD/YY"),
      endDate: endDate.format("MM/DD/YY"),
      allDay: true,
    };
    this.props.createSprint(requestObj);
    this.handleClose();
  };

  quickCreate = weeksAdv => {
    const startDate = this.futureMonday(weeksAdv);
    const name = `${startDate} Sprint`;
    const requestObj = {
      name,
      startDate,
      endDate: this.futureMonday(weeksAdv + 1),
    };
    this.props.createSprint(requestObj);
    this.handleClose();
  };

  futureMonday = weeksAdv => {
    const d = new Date();
    d.setDate(d.getDate() + (weeksAdv - 1) * 7 + ((1 + 7 - d.getDay()) % 7));
    const options = { month: "2-digit", day: "2-digit", year: "2-digit" };
    return d.toLocaleDateString("en-US", options);
  };

  renderQuickCreate = weeksAdv => {
    const { sprints } = this.props;
    return (
      <Button
        onClick={() => this.quickCreate(weeksAdv)}
        style={this.padding}
        color={weeksAdv === 1 ? "blue" : "red"}
        disabled={
          sprints &&
          !!sprints.find(
            sprint => sprint.name === `${this.futureMonday(weeksAdv)} Sprint`
          )
        }
      >
        {"Quick Create: " + this.futureMonday(weeksAdv)}
      </Button>
    );
  };

  render() {
    const { startDate, endDate, modalOpen } = this.state;

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button icon labelPosition="left" onClick={this.handleOpen} primary>
            New Sprint
            <Icon color="red" name="plus" />
          </Button>
        }
      >
        <Modal.Header className="ModalHeader">Create Sprint</Modal.Header>
        <Grid columns={2} divided>
          <Grid.Column width={9}>
            <Form className="ModalForm">
              <Form.Field>
                <label>Sprint Name</label>
                <Input size="tiny" type="text" onChange={this.handleName} />
              </Form.Field>
              <Form.Field inline>
                <ReactDatePicker
                  selected={startDate}
                  onChange={this.handleChangeStartDate}
                />
              </Form.Field>
              <Form.Field inline>
                <ReactDatePicker
                  selected={endDate}
                  onChange={this.handleChangeEndDate}
                />
              </Form.Field>
              <Button
                onClick={this.handleSubmit}
                disabled={this.handleValidate()}
                style={this.padding}
                color="green"
              >
                Create Sprint
              </Button>
            </Form>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" width={7}>
            {this.renderQuickCreate(1)}
            <br />
            <br />
            {this.renderQuickCreate(2)}
          </Grid.Column>
        </Grid>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  createSprint: CommonActions.createSprint,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintModal);
