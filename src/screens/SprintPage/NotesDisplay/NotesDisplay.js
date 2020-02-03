import _ from "lodash";
import React, { Component } from "react";

import {
  Icon,
  Table,
  Loader,
} from "semantic-ui-react";

import Editor from "../../../components/Editor/Editor";

import { updateIssueNotes, updateShowNotes } from "../../../utils/api";
import "./NotesDisplay.css";

class NotesDisplay extends Component {
  state = {
    issueList: [],
    showNoteList: {},
    editNoteList: {},
    issueNoteList: {},
    issueStatusList: {},
    direction: null,
    displayTimelogs: false,
  };

  componentDidMount() {
    const { selectedSprint, issues } = this.props;
    this._loadData(selectedSprint, issues);
  }

  componentDidUpdate(prevProps) {
    const { selectedSprint, issues } = this.props;
    if (
      selectedSprint.id !== prevProps.selectedSprint.id ||
      prevProps.issues !== issues
    ) {
      this._loadData(selectedSprint, issues);
    }
  }

  _loadData = (selectedSprint, issues) => {
    const showNoteList = {};
    const editNoteList = {};
    const issueNoteList = {};
    issues &&
      issues.map(issue => (showNoteList[issue.id] = !!issue.show_notes));
    issues && issues.map(issue => (editNoteList[issue.id] = false));
    issues && issues.map(issue => (issueNoteList[issue.id] = issue.notes));

    // Issues, note toggle array, summing times for footer
    this.setState({
      issueList: issues,
      showNoteList,
      editNoteList,
      issueNoteList,
    });
  };

  mapProjectId = id => {
    const { projects } = this.props;
    const project = projects.find(proj => proj.id === id);
    return project ? project.name : "";
  };

  mapSprintId = id => {
    const { sprints } = this.props;
    const sprint = sprints.find(spr => spr.id === id);
    return sprint;
  };

  handleIssueNotes = (id, value) => {
    const { issueNoteList } = this.state;
    issueNoteList[id] = value;
    this.setState({
      issueNoteList,
    });
  };

  handleShowNotes = id => {
    const { showNoteList } = this.state;
    showNoteList[id] = !showNoteList[id];
    this.setState({
      showNoteList,
    });
    updateShowNotes(id, showNoteList[id] ? 1 : 0);
  };

  handleEditNotes = id => {
    const { editNoteList } = this.state;
    editNoteList[id] = !editNoteList[id];
    this.setState({
      editNoteList,
    });
  };

  handleSaveIssueNotes = (id, notes) => {
    const { issueNoteList } = this.state;
    issueNoteList[id] = notes;
    this.setState({ issueNoteList })
    updateIssueNotes(id, notes)
  };

  // I can display quill content as html, but first, I need to do some parsing
  // to get all the new lines/paragraphs to look the right way
  unquill = (text) => {
    text = text.replace(new RegExp("</p><p><br /></p><p>", 'g'), "eibkdjlfbasdf");
    text = text.replace(new RegExp("</p><p><br></p><p>", 'g'), "eibkdjlfbasdf");
    text = text.replace(new RegExp("</p><p>", 'g'), "\n");
    text = text.replace(new RegExp("eibkdjlfbasdf", 'g'), "</p><p>");

    // For empty notes
    // TODO: it's possible the first condition is not necessary and that 
    // it was only needed after running the python scripts
    if (text === "<p></p>" || text === "") {
      text = "<p><br></p>"
      // text = "<p>Issue Notes...</p>"
    }
    return text;
  }

  renderName = (name, id) => (
    <div>
      <a href={`/issue/${id}`} style={{ color: "#888" }}>
        {name}
        <Icon color="red" className="super" name="plus" size="small" />
      </a>
    </div>
  );

  renderIssue = issue => {
    const {
      name,
      id,
      project_id,
    } = issue;

    return (
      <Table.Body key={id}>
        <Table.Row>
          <Table.Cell width={8} onClick={() => this.handleShowNotes(id)} collapsing>
            {name}
          </Table.Cell>
          <Table.Cell width={8} onClick={() => this.handleShowNotes(id)} collapsing>
            {this.mapProjectId(project_id)}
          </Table.Cell>
        </Table.Row>
        {this.state.showNoteList[id] && (
          <Table.Row>
            <Table.Cell colSpan="6">
              {this.state.editNoteList[id] ? (
                <Editor
                  type="IssueNotes"
                  autoFocus
                  onSave={this.handleSaveIssueNotes}
                  callback={this.handleEditNotes}
                  autoSize
                  id={id}
                  content={this.state.issueNoteList[id]}
                />) :
                <div
                  onClick={() => this.handleEditNotes(id)}
                  style={{ "whiteSpace": "pre-line" }}
                  // Yes I understand this is literally running HTML from text input
                  // But this stuff is self hosted so who cares?
                  dangerouslySetInnerHTML={{ __html: this.unquill(this.state.issueNoteList[id]) }}
                />
              }
            </Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    );
  };

  render() {
    const { selectedSprint } = this.props;
    const {
      issueList,
    } = this.state;

    if (!selectedSprint || !issueList) {
      return <Loader active inline />;
    }

    if (issueList.length === 0) {
      return <div />;
    }

    return (
      <Table fixed celled size="large" compact>
        {issueList.map(this.renderIssue)}
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="3" />
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default NotesDisplay;
