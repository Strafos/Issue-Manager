import React, { Component } from "react";
import ReactQuill from "react-quill"; // ES6

import { connect } from "react-redux";
import { Segment } from "semantic-ui-react";

import "react-quill/dist/quill.bubble.css"; // ES6

import "./Editor.css";

import * as Actions from "../../../sprintPageActions";
import { updateSprintNotes } from "../../../../../utils/api";

const saveTime = 1000;

const Embed = ReactQuill.Quill.import('blots/block/embed');
class Hr extends Embed {
  static create(value) {
    let node = super.create(value);
    return node;
  }
}
Hr.blotName = 'hr';
Hr.tagName = 'hr';

ReactQuill.Quill.register({
  'formats/hr': Hr,
});

class Editor extends Component {
  state = {}

  constructor(props) {
    super(props)
    this.quillRef = null;
    this.reactQuillRef = null;
    this.handleStrikethrough = this.handleStrikethrough.bind(this);
    this.handleStrikethroughLine = this.handleStrikethroughLine.bind(this);
    this.handleInsertDivider = this.handleInsertDivider.bind(this);
    this.registerFormats = this.registerFormats.bind(this);

    this.handleContentChange = this.handleContentChange.bind(this);
  }

  componentDidMount() {
    const { content } = this.props;
    this.registerFormats()
    this.setState({
      content: content || "",
      prevContent: content || "",
    });
  }

  componentDidUpdate(prevProps) {
    const { content } = this.props;
    this.registerFormats()
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

  registerFormats() {
    // Ensure React-Quill references is available:
    if (typeof this.reactQuillRef.getEditor !== 'function') return;
    // Skip if Quill reference is defined:
    if (this.quillRef != null) return;

    const quillRef = this.reactQuillRef.getEditor() // could still be null

    if (quillRef != null) {
      this.quillRef = quillRef;
    }
  }

  handleSave = () => {
    const { content, prevContent } = this.state;
    const { id } = this.props;
    if (prevContent !== content) {
      this.setState({ prevContent: content });
      const processed_content = content;
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
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  handleStrikethrough(range, context) {
    if (range) {
      // If entire selection has strike: format = {strike: true}
      // Otherwise: format = {} 
      const newVal = !('strike' in context.format);
      this.quillRef.format('strike', newVal);
    }
  }

  handleInsertDivider(range, _) {
    if (range) {
      this.quillRef.insertEmbed(range.index, "hr", "null")
    }
  }

  handleStrikethroughLine(range, context) {
    if (range) {
      const prefix = context.prefix;
      const suffix = context.suffix;
      const index = range.index - prefix.length;
      const len = prefix.length + suffix.length;

      this.quillRef.setSelection(index, len);
      this.handleStrikethrough(range, context);
    }
  }


  render() {
    const { autoSize } = this.props;
    const { content } = this.state;

    return (
      <Segment>
        <ReactQuill
          // Do these matter?
          className="quill-container"
          bounds={".app"}

          ref={(el) => { this.reactQuillRef = el }}
          style={autoSize ? {} : { height: "500px" }}
          value={content}
          theme='bubble'
          onChange={this.handleContentChange}
          modules={{
            clipboard: { matchVisual: false },
            keyboard: {
              bindings: {
                strikethrough: {
                  key: 's',
                  ctrlKey: true,
                  shiftKey: true,
                  handler: this.handleStrikethrough
                },
                strikethrough_line: {
                  key: 's',
                  ctrlKey: true,
                  handler: this.handleStrikethroughLine
                },
                divider: {
                  key: 'h',
                  ctrlKey: true,
                  handler: this.handleInsertDivider
                },
              }
            },
          }}
          placeholder={this.props.placeholder} />
      </Segment>
    )
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
