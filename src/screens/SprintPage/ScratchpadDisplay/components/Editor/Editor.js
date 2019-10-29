import React, { Component } from "react";
import ReactQuill from "react-quill"; // ES6
import { connect } from "react-redux";
import { Segment } from "semantic-ui-react";

import "react-quill/dist/quill.bubble.css"; // ES6

import "./Editor.css";

import * as Actions from "../../../sprintPageActions";
import { updateSprintNotes } from "../../../../../utils/api";

const saveTime = 1000;

class Editor extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.handleContentChange = this.handleContentChange.bind(this);
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  componentDidMount() {
    const { content } = this.props;
    this.setState({
      content: content || "",
      prevContent: content || "",
    });
  }

  componentDidUpdate(prevProps) {
    const { content } = this.props;
    if (content !== prevProps.content) {
      this.setState({
        content: content || "",
        prevContent: content || "",
      });
    }
  }

  // Autosave on close
  componentWillUnmount() {
    clearTimeout(this.saveTimer);
    const { content } = this.state;
    const { id } = this.props;
    this.handleAPI(id, content);
  }

  // An attempt to handle the pre tag,
  // but not great solution because it removes whitespace
  // processContent = content => {
  //   return content;
  //   const patt = /<pre[^>]*>/g;
  //   var c1 = content.replace(patt, "<p>");
  //   const patt2 = /<\/pre[^>]*>/g;
  //   return content.replace(patt2, "</p>");
  // };

  handleSave = () => {
    const { content, prevContent } = this.state;
    const { id } = this.props;
    if (prevContent !== content) {
      this.setState({ prevContent: content });
      // const processed_content = this.processContent(content);
      const processed_content = content;
      console.log(processed_content);
      this.handleAPI(id, processed_content);
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
    // console.log(content);
    // console.log(delta);
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  render() {
    const { autoSize } = this.props;
    const { content } = this.state;

    return (
      <Segment>
        <ReactQuill
          style={autoSize ? {} : { height: "500px" }}
          className="quill-container"
          theme="bubble"
          value={content}
          onChange={this.handleContentChange}
          bounds={".app"}
          modules={{
            clipboard: { matchVisual: false },
          }}
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
