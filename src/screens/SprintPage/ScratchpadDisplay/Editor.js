import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill"; // ES6
import { connect } from "react-redux";
import { Loader, Segment } from "semantic-ui-react";

import "./Editor.css";

import * as Actions from "../sprintPageActions";

import "react-quill/dist/quill.bubble.css"; // ES6

const saveTime = 2000;

class Editor extends Component {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      content: data ? data.content : "",
      prevContent: data ? data.content : "",
    };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  _loadData = selectedSprint => {};

  handleSave = () => {
    const { content, prevContent } = this.state;
    const { data } = this.props;
    this.saveTimer = setTimeout(this.handleSave, saveTime);
    if (prevContent !== content) {
      console.log(data.id);
      console.log(content);
      console.log(prevContent);
      this.props.setScratchpad(data.id, content);
      this.setState({ prevContent: content });
    }
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
      <Segment style={{ "padding-top": "10px" }}>
        <ReactQuill
          style={{ height: "500px" }}
          className="quill-container"
          theme="bubble"
          value={content}
          onChange={this.handleContentChange}
          bounds={".app"}
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
