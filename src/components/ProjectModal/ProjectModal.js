import React, { Component } from "react";
import "./ProjectModal.css";
import { Icon, Segment, Button, Modal, Input } from "semantic-ui-react";

import { createProject } from "../../utils/api/api";

import "react-datepicker/dist/react-datepicker.css";

class ProjectModal extends Component {
  state = {
    name: ""
  };

  handleOpen = () =>
    this.setState({
      modalOpen: true
    });

  handleClose = () =>
    this.setState({
      modalOpen: false
    });

  handleName = (event, { value }) => {
    this.setState({
      name: value
    });
  };

  handleSubmit = () => {
    const { name } = this.state;
    const requestObj = {
      name
    };
    createProject(requestObj);
    this.handleClose();
  };

  handleName = (event, { value }) => {
    this.setState({
      name: value
    });
  };

  render() {
    const { modalOpen } = this.state;

    return (
      <Modal
        size="mini"
        basic
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button icon labelPosition="left" onClick={this.handleOpen} primary>
            New Project
            <Icon color="red" name="plus" />
          </Button>
        }
      >
        <Segment inverted>
          <Input
            inverted
            action={{ onClick: this.handleSubmit }}
            placeholder="Project Name"
            onChange={this.handleName}
          />
        </Segment>
      </Modal>
    );
  }
}

export default ProjectModal;
