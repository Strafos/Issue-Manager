import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";

import {
  Container,
  Button,
  Modal,
  Input,
  Form,
  Divider,
} from "semantic-ui-react";
import { connect } from "react-redux";

import "react-datepicker/dist/react-datepicker.css";
import "rc-time-picker/assets/index.css";

class EventModal extends Component {
  state = {
    startDate: null,
    title: "",
    modalOpen: false,
    isRepeated: false,
    weeksRepeated: 0,
  };

  componentWillMount() {
    const { modalOpen } = this.props;
    this.setState({ modalOpen });
  }

  componentDidUpdate(prevProps) {
    const { modalOpen } = this.props;
    const modalOpenState = this.state.modalOpen;
    if (modalOpen !== modalOpenState) {
      this.setState({ modalOpen });
    }
  }

  handleTitle = (event, { value }) => {
    this.setState({
      title: value,
    });
  };

  handleRepeat = (event, { value }) => {
    this.setState({
      weeksRepeated: value,
    });
  };

  handleValidate = () => {
    const { title } = this.state;
    return title.length === 0;
  };

  handleSubmit = () => {
    const { onModalClose, createEvent, id } = this.props;
    const { title, startDate, isRepeated, weeksRepeated } = this.state;
    const eventList = [
      {
        id,
        title,
        start: startDate.format("MM/DD/YY"),
        allDay: 1,
      },
    ];
    if (isRepeated) {
      for (let i = 1; i < parseInt(weeksRepeated, 10); i++) {
        startDate.add(7, "days");
        const eventObj = {
          id,
          title,
          start: startDate.format("MM/DD/YY"),
          allDay: 1,
        };
        eventList.push(eventObj);
      }
    }

    createEvent(eventList);

    onModalClose();
  };

  handleChangeStartDate = date => {
    this.setState({
      startDate: date,
    });
  };

  render() {
    const { modalOpen, startDate, isRepeated } = this.state;
    const { onModalClose } = this.props;

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={onModalClose}
        open={modalOpen}
        classTitle="Modal"
        closeOnDimmerClick={false}
      >
        <Container style={{ padding: "20px" }} textAlign="left">
          <Form>
            <Form.Field>
              <label>Event Title</label>
              <Input size="tiny" type="text" onChange={this.handleTitle} />
            </Form.Field>
            <Form.Field>
              <label>Start</label>
              <ReactDatePicker
                selected={startDate}
                onChange={this.handleChangeStartDate}
              />
              {/* <TimePicker
                defaultValue={undefined}
                showSecond={false}
                minuteStep={15}
              /> */}
            </Form.Field>
            <Form.Checkbox
              label={"Repeated"}
              onClick={() => this.setState({ isRepeated: !isRepeated })}
              value={isRepeated}
            />
            {isRepeated && (
              <Form.Field>
                <label>Weeks Repeated</label>
                <Input size="tiny" type="text" onChange={this.handleRepeat} />
              </Form.Field>
            )}
          </Form>
          <Divider />
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            style={this.padding}
            color="green"
          >
            Create Event
          </Button>
        </Container>
        <Container textAlign="center" />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventModal);
