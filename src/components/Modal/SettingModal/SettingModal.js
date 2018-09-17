import React, { Component } from "react";
import {
  TextArea,
  Container,
  Icon,
  Form,
  Button,
  Modal,
  Divider,
} from "semantic-ui-react";
import { connect } from "react-redux";

import * as CommonActions from "../../../commonActions";

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
    const { setting } = this.state;
    const requestObj = {};
    this.props.createIssue(requestObj);
    this.handleClose();
  };

  handleChange = (event, { value }) => {
    this.setState({
      setting: value,
    });
  };

  renderTextArea = () => {
    return (
      <TextArea
        onChange={this.handleChange}
        style={{
          minHeight: 250,
          backgroundColor: "#282828",
          color: "#BEBEBE",
          fontSize: 17,
        }}
        value={this.state.setting}
      />
    );
  };

  render() {
    const { modalOpen } = this.state;

    return (
      <Modal
        size="large"
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
        <Modal.Header textAlign="left">Settings</Modal.Header>
        <Container textAlign="left">
          <Form className="Left">
            <Form.Field control={this.renderTextArea} />
          </Form>

          <Divider />
          <Button
            onClick={this.handleSubmit}
            disabled={this.handleValidate()}
            color="black"
          >
            Save settings
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
