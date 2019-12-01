import React, { Component } from "react";
import "./Jots.css";
import { Form, TextArea, Button, Segment } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

import { connect } from "react-redux";

import * as CommonActions from "../../commonActions";

class Jots extends Component {
  state = {
    edit: false
  };

  componentDidMount() {
    const { jots } = this.props;
    this.setState({
      currJot: jots
    })
  }

  componentDidUpdate(prevProps) {
    const { jots } = this.props;
    if (jots !== prevProps.jots) {
      this.setState({
        currJot: jots
      })
    }
  }

  handleSubmit = () => {
    const { js } = this.props;
    js.jots = this.state.currJot;
    this.props.updateJots(js);

    this.handleChangeEdit()
  };

  handleClear = () => {
    const { js } = this.props;
    this.setState({
      currJot: "",
      edit: false
    })
    js.jots = "";
    this.props.updateJots(js);

    this.handleChangeEdit()
  };

  handleInput = (event, data) => {
    this.setState({
      currJot: data.value,
    });
  };

  handleChangeEdit = () => {
    this.setState({
      edit: !this.state.edit
    })
  }

  render() {
    const { edit, currJot } = this.state;

    return (
      <div className="center">
        {currJot && <br />}
        {currJot && (edit ? (
          <Form>
            <TextArea
              autoFocus
              onChange={this.handleInput}
              style={{
                minHeight: 200,
                backgroundColor: "#282828",
                color: "#BEBEBE",
              }}
              value={currJot}
            />
            <Button
              color="red"
              onClick={this.handleSubmit}
            >
              Save
            </Button>
            <Button
              color="red"
              onClick={this.handleClear}
            >
              Clear
            </Button>
          </Form>
        ) : (
            <Segment>
              <p
                style={{
                  "whiteSpace": "pre-line",
                  // "textAlign": "left"
                }}
                onClick={this.handleChangeEdit}>
                {currJot}
              </p>
            </Segment>
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jots: state.commonData.jots.data && state.commonData.jots.data.jots,
  js: state.commonData.jots.data,
});

const mapDispatchToProps = {
  updateJots: CommonActions.updateJots,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Jots);
