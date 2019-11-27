import React, { Component } from "react";
import ReactQuill from "react-quill"; // ES6

import { connect } from "react-redux";

import "react-quill/dist/quill.bubble.css"; // ES6

import "./Editor.css";

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
    this.registerFormats = this.registerFormats.bind(this);

    this.handleInsertDivider = this.handleInsertDivider.bind(this);
    this.handleCallback = this.handleCallback.bind(this);

    this.handleStrikethrough = this.handleStrikethrough.bind(this);
    this.handleStrikethroughLine = this.handleStrikethroughLine.bind(this);

    this.handleBoldLine = this.handleBoldLine.bind(this);

    this.handleContentChange = this.handleContentChange.bind(this);
  }

  componentDidMount() {
    const { content, autoFocus } = this.props;
    this.registerFormats()
    this.setState({
      content: content || "",
      prevContent: content || "",
    });
    autoFocus && this.quillRef.focus()
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
    const { id, onSave } = this.props;
    onSave(id, content);
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
    const { id, onSave } = this.props;
    if (prevContent !== content) {
      this.setState({ prevContent: content });
      onSave(id, content);
    }
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  };

  handleContentChange(content, delta, source, editor) {
    clearTimeout(this.saveTimer);
    this.setState({ content });
    this.saveTimer = setTimeout(this.handleSave, saveTime);
  }

  handleInsertDivider(range, _) {
    if (range) {
      this.quillRef.insertEmbed(range.index, "hr", "null")
    }
  }

  handleFormat(range, context, format) {
    if (range) {
      // If entire selection has strike: format = {strike: true}
      // Otherwise: format = {} 
      const newVal = !(format in context.format);
      this.quillRef.format(format, newVal);
    }
  }

  handleFormatLine(range, context, format) {
    if (range) {
      const prefix = context.prefix;
      const suffix = context.suffix;
      const index = range.index - prefix.length;
      const len = prefix.length + suffix.length;

      this.quillRef.setSelection(index, len);
      this.handleFormat(range, context, format);
    }
  }

  handleStrikethrough(range, context) {
    this.handleFormat(range, context, "strike");
  }

  handleStrikethroughLine(range, context) {
    this.handleFormatLine(range, context, "strike");
  }

  handleBoldLine(range, context) {
    this.handleFormatLine(range, context, "bold");
  }

  handleCallback(range, context) {
    const { id, callback } = this.props;
    if (callback) {
      callback(id);
    }
  }

  render() {
    const { autoSize, } = this.props;
    const { content } = this.state;

    return (
      <ReactQuill
        // Do these matter?
        className="quill-container"
        bounds={".app"}

        ref={(el) => { this.reactQuillRef = el }}
        style={autoSize ? { "minHeight": "5px" } : { height: "500px" }}
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
              bold_line: {
                key: 'b',
                ctrlKey: true,
                handler: this.handleBoldLine
              },
              divider: {
                key: 'h',
                ctrlKey: true,
                handler: this.handleInsertDivider
              },
              callback: {
                key: 'enter',
                ctrlKey: true,
                handler: this.handleCallback,
              },
              callback2: {
                key: 'enter',
                shiftKey: true,
                handler: this.handleCallback,
              },
            }
          },
        }}
        placeholder={this.props.placeholder} />
    )
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Editor);
