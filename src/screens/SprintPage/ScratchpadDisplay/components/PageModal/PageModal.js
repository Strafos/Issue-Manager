import React, { Component } from "react";
import { Icon, Button, Modal, Input, Form, Divider } from "semantic-ui-react";
import { connect } from "react-redux";

import "./PageModal.css";

import * as Actions from "../../../sprintPageActions";

class PageModal extends Component {
  state = {
    name: "",
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

  handleName = (event, { value }) => {
    this.setState({
      name: value,
    });
  };

  handleValidate = () => {
    const { name } = this.state;
    return name.length === 0;
  };

  handleSubmit = () => {
    const { name } = this.state;
    this.props.createPage(name);
    this.handleClose();
  };

  render() {
    const { modalOpen } = this.state;

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button
            floated="right"
            onClick={this.handleOpen}
            labelPosition="left"
            icon
            color="black"
          >
            New Page
            <Icon color="red" name="plus" />
          </Button>
        }
      >
        <Form className="ModalForm">
          <Form.Field>
            <label>Page name</label>
            <Input size="tiny" type="text" onChange={this.handleName} />
          </Form.Field>
          <Divider />
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            style={this.padding}
            color="black"
          >
            Create
          </Button>
        </Form>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  createPage: Actions.createPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageModal);
