import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill"; // ES6
import { connect } from "react-redux";
import { Loader, Segment } from "semantic-ui-react";

import "react-quill/dist/quill.bubble.css"; // ES6

import "./Editor.css";

import * as Actions from "../sprintPageActions";
import { updateSprintNotes } from "../../../utils/api";

const saveTime = 1000;

class Editor extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      content: data ? data.content : "",
      prevContent: data ? data.content : "",
    });
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setState({
        content: data ? data.content : "",
        prevContent: data ? data.content : "",
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.saveTimer);
    const { content } = this.state;
    const { data } = this.props;
    this.handleAPI(data.id, content);
  }

  handleSave = () => {
    const { content, prevContent } = this.state;
    const { data } = this.props;
    if (prevContent !== content) {
      this.setState({ prevContent: content });
      this.handleAPI(data.id, content);
    }
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  };

  handleAPI = (id, content) => {
    const { setScratchpad, sprintScratchpad } = this.props;
    if (sprintScratchpad) {
      updateSprintNotes(id, content);
    } else {
      setScratchpad(id, content);
    }
  };

  handleContentChange(content, delta, source, editor) {
    clearTimeout(this.saveTimer);
    this.setState({ content });
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  render() {
    const { autoSize } = this.props;
    const { content } = this.state;

    if (!true) {
      return <Loader active inline />;
    }

    return (
      <Segment>
        <ReactQuill
          style={autoSize ? {} : { height: "500px" }}
          className="quill-container"
          theme="bubble"
          value={content}
          onChange={this.handleContentChange}
          bounds={".app"}
          modules={{ clipboard: { matchVisual: false } }}
        />
      </Segment>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  setScratchpad: Actions.setScratchpad,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
