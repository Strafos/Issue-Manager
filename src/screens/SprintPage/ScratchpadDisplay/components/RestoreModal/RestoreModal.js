import React, { Component } from "react";
import { Icon, Button, Modal, Form, Divider } from "semantic-ui-react";
import { connect } from "react-redux";

import "react-datepicker/dist/react-datepicker.css";

import "./RestoreModal.css";

import ScratchpadDropDown from "../ScratchpadDropDown";
import * as Actions from "../../../sprintPageActions";

class RestoreModal extends Component {
  state = {
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

  handleScratchpadSelect = (_, { value }) => {
    const { scratchpads } = this.props;
    this.setState({
      selectedScratchpad: scratchpads.find(
        scratchpad => scratchpad.id === value
      ),
    });
  };

  handleSubmit = () => {
    const { selectedScratchpad } = this.state;
    this.props.archiveScratchpad(
      selectedScratchpad.id,
      selectedScratchpad.content,
      selectedScratchpad.title,
      0
    );
    this.props.archivePage(selectedScratchpad.page, 0);
    this.handleClose();
  };

  render() {
    const { modalOpen, selectedScratchpad } = this.state;
    const { scratchpads, selectedPage } = this.props;

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
            disabled={selectedPage !== "archive"}
            color="black"
          >
            Restore
            <Icon color="red" name="plus" />
          </Button>
        }
      >
        <Form className="ModalForm">
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
            Restore Scratchpad
          </Button>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  archiveScratchpad: Actions.archiveScratchpad,
  archivePage: Actions.archivePage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestoreModal);
