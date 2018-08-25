import React, { Component } from "react";
import ReactQuill, { Quill } from "react-quill"; // ES6

import "./Editor.css";

import { Loader, Segment } from "semantic-ui-react";

import "react-quill/dist/quill.bubble.css"; // ES6

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { content: "" };
    this.handleContentChange = this.handleContentChange.bind(this);
    this.saveTimer = setInterval(this.handleSave, 3000);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  _loadData = selectedSprint => {};

  handleSave = () => {
    const { content } = this.state;
    console.log(content);
    this.saveTimer = setInterval(this.handleSave, 3000);
  };

  handleContentChange(content, delta, source, editor) {
    this.setState({ content });
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

export default Editor;
