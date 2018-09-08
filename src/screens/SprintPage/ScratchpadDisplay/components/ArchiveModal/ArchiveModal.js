import React, { Component } from "react";
import { Icon, Button, Modal, Input, Form, Divider } from "semantic-ui-react";
import { connect } from "react-redux";

import "react-datepicker/dist/react-datepicker.css";

import "./ArchiveModal.css";

import ScratchpadDropDown from "../ScratchpadDropDown";
import * as Actions from "../../../sprintPageActions";

class ArchiveModal extends Component {
  state = {
    title: "",
    selectedScratchpad: null,
    modalOpen: false,
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

  handleTitle = (event, { value }) => {
    this.setState({
      title: value,
    });
  };

  handleScratchpadSelect = (_, { value }) => {
    const { scratchpads } = this.props;
    this.setState({
      selectedScratchpad: scratchpads.find(
        scratchpad => scratchpad.id === value
      ),
    });
  };

  handleSubmit = () => {
    const { selectedScratchpad, title } = this.state;
    this.props.archiveScratchpad(
      selectedScratchpad.id,
      selectedScratchpad.content,
      title
    );
    this.handleClose();
  };

  render() {
    const { modalOpen, selectedScratchpad } = this.state;
    const { scratchpads } = this.props;

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button
            floated="left"
            labelPosition="left"
            icon
            onClick={this.handleOpen}
            color="black"
          >
            Archive
            <Icon color="red" name="trash" />
          </Button>
        }
      >
        <Form className="ModalForm">
          <Form.Field>
            <label>Archive name</label>
            <Input size="tiny" type="text" onChange={this.handleTitle} />
          </Form.Field>
          <ScratchpadDropDown
            value={selectedScratchpad && selectedScratchpad.id}
            onChange={this.handleScratchpadSelect}
            scratchpads={scratchpads}
          />

          <Divider />
          <Button
            onClick={this.handleSubmit}
            disabled={false}
            style={this.padding}
            color="black"
          >
            Archive
          </Button>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  archiveScratchpad: Actions.archiveScratchpad,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchiveModal);
