import React, { Component } from "react";
import "./ProjectModal.css";
import { Segment, Grid, Button, Modal, Input, Form } from "semantic-ui-react";

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
    const { sprints, projects } = this.props;

    return (
      <Modal
        size="mini"
        basic
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button onClick={this.handleOpen} primary>
            New Project
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
