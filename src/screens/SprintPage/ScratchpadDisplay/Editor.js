import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill"; // ES6
import { connect } from "react-redux";
import { Loader, Segment } from "semantic-ui-react";

import "./Editor.css";

import * as Actions from "../sprintPageActions";

import "react-quill/dist/quill.bubble.css"; // ES6

const saveTime = 1000;

class Editor extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    console.log(data.content);
    this.state = {
      content: data ? data.content : "",
      prevContent: data ? data.content : "",
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  handleSave = () => {
    const { content, prevContent } = this.state;
    const { data } = this.props;
    if (prevContent !== content) {
      this.props.setScratchpad(data.id, content);
      this.setState({ prevContent: content });
    }
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  };

  handleContentChange(content, delta, source, editor) {
    clearTimeout(this.saveTimer);
    this.setState({ content });
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  render() {
    const { content } = this.state;

    if (!true) {
      return <Loader active inline />;
    }

    return (
      <Segment style={{ paddingTop: "10px" }}>
        <ReactQuill
          style={{ height: "500px" }}
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
