import React, { Component } from "react";
import {
  TextArea,
  Container,
  Icon,
  Button,
  Modal,
  Divider,
} from "semantic-ui-react";
import { connect } from "react-redux";

import * as CommonActions from "../../../commonActions";

import "./SettingModal.css";

class SettingModal extends Component {
  state = { modalOpen: false };

  componentWillMount() {
    const { setting } = this.props;
    this.setState({ setting: JSON.stringify(setting) });
  }

  componentDidUpdate(prevProps) {
    const { setting } = this.props;
    if (setting !== prevProps.setting) {
      this.setState({
        setting: JSON.stringify(setting),
      });
    }
  }

  handleOpen = () =>
    this.setState({
      modalOpen: true,
    });

  handleClose = () =>
    this.setState({
      modalOpen: false,
    });

  handleValidate = () => {
    const {} = this.state;
    return false;
  };

  handleSubmit = () => {
    const {} = this.state;
    const requestObj = {};
    this.props.createIssue(requestObj);
    this.handleClose();
  };

  render() {
    const { setting, modalOpen } = this.state;
    console.log(this.props.setting);

    return (
      <Modal
        size="mini"
        closeIcon
        centered
        onClose={this.handleClose}
        open={modalOpen}
        trigger={
          <Button
            icon
            labelPosition="left"
            onClick={this.handleOpen}
            color="black"
          >
            <Icon color="red" name="square" />
            Settings
          </Button>
        }
        className="Modal"
      >
        <Modal.Header textAlign="left">Create Issue</Modal.Header>
        <Container textAlign="left">
          <TextArea
            onChange={this.handleNotes}
            style={{
              minHeight: 250,
              backgroundColor: "#282828",
              color: "#BEBEBE",
              fontSize: 17,
            }}
            value={setting}
          />
          <Divider />
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            style={this.padding}
            color="black"
          >
            Create Issue
          </Button>
        </Container>
        <Container textAlign="center" />
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  setting: state.commonData.settings.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingModal);
