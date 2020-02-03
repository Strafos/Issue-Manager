import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Grid,
  Button,
  Menu,
  TextArea,
  Header,
  Container,
  Loader,
  Divider,
  Segment,
} from "semantic-ui-react";

import * as CommonActions from "../../commonActions";
import * as Actions from "./sprintPageActions";
import "./NotePage.css";

import Editor from "../../components/Editor/Editor";
import { updateSprintQuote, updateSprintNotes } from "../../utils/api";
import NotesDisplay from "./NotesDisplay/NotesDisplay";

class NoteDisplay extends Component {
  state = {
    issueList: [],
    display: "issue",
    quote: "",
    editQuote: false,
    hideTitle: true,
    scratchpadPage: null,
  };

  componentDidMount() {
    const { match } = this.props;
    this.props.getSprintIssues(match.params.id);
    this.props.getSprint(match.params.id);
    this.props.getPages();
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (prevProps.match.params.id !== match.params.id) {
      this.props.getSprintIssues(match.params.id);
      this.props.getSprint(match.params.id);
    }
  }

  handleSaveSprintQuote = () => {
    const { selectedSprint } = this.props;
    const { quote } = this.state;
    this.toggleEditSprintQuote();
    updateSprintQuote(quote || selectedSprint.quote, selectedSprint.id).then(
      res => {
        if (!res || res.status !== "Success") {
          this.props.error("Failed to save quote");
        }
      }
    );
  };

  handleHideTitle = () => {
    const { hideTitle } = this.state;

    this.setState({
      hideTitle: hideTitle ? false : true
    })
  };


  handleSprintQuoteChange = (event, { value }) => {
    this.setState({
      quote: value,
    });
  };

  toggleEditSprintQuote = () => {
    this.setState({
      editQuote: !this.state.editQuote,
    });
  };

  renderPageMenu = page => {
    const { scratchpadPage } = this.state;
    return (
      <Menu.Item
        name={page.name}
        active={scratchpadPage && scratchpadPage.id === page.id}
        key={page.id}
        onClick={() => {
          this.setState({ scratchpadPage: page, display: "scratchpad" });
        }}
      />
    );
  };

  render() {
    const { editQuote, quote, hideTitle, display, scratchpadPage } = this.state;
    const {
      projectList,
      sprintList,
      issueList,
      selectedSprint,
      pages,
    } = this.props;

    if (!selectedSprint) {
      return <Loader active inline />;
    }

    return (
      <div>
        <Grid verticalAlign="top" columns={4} stretched>
          <Grid.Column textAlign="left" width={3}>
            <Grid.Row>
              {!hideTitle &&
                <Header floated="left" as="h1">
                  {selectedSprint && selectedSprint.name}
                  <Header.Subheader>
                    {editQuote ? (
                      <div>
                        <TextArea
                          onChange={this.handleSprintQuoteChange}
                          defaultValue={quote || selectedSprint.quote}
                        />
                        <Button
                          color="black"
                          floated="right"
                          onClick={this.handleSaveSprintQuote}
                        >
                          Save
                      </Button>
                      </div>
                    ) : (
                        <div onClick={this.toggleEditSprintQuote}>
                          {quote || selectedSprint.quote || "no quote"}
                        </div>
                      )}
                  </Header.Subheader>
                </Header>
              }
            </Grid.Row>
          </Grid.Column>
          <Grid.Column verticalAlign="middle" textAlign="left" width={1}>
            {!hideTitle &&
              selectedSprint && selectedSprint.start_date + "\n" + selectedSprint.end_date
            }
          </Grid.Column>
          <Grid.Column width={6}>
            <Menu pointing>
              {pages && pages.map(page => this.renderPageMenu(page))}
              <Menu.Item
                name="Archive"
                active={scratchpadPage && scratchpadPage.name === "archive"}
                key={-1}
                position="right"
                onClick={() => {
                  this.setState({
                    scratchpadPage: { name: "archive", id: "archive" },
                  });
                  this.setState({ display: "scratchpad" });
                }}
              />
            </Menu>
          </Grid.Column>
        </Grid>
        <Divider />

        <NotesDisplay
          selectedSprint={selectedSprint}
          projects={projectList}
          sprints={sprintList}
          issues={issueList}
        />

        <Segment>
          <Editor
            onSave={updateSprintNotes}
            autoSize
            id={selectedSprint.id}
            content={selectedSprint.notes}
          />
        </Segment>
        <Button
          color="red"
          floated="left"
          onClick={this.handleHideTitle}
        >
          Hide
        </Button>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  sprintList: state.commonData.sprintList.data,
  issueList: state.commonData.sprintIssues.data,
  selectedSprint: state.commonData.sprint.data && state.commonData.sprint.data,
  projectList: state.commonData.projects.data || [],
  pages: state.sprintPage.pages.data,
});

const mapDispatchToProps = {
  getSprintIssues: CommonActions.getSprintIssues,
  getSprint: CommonActions.getSprint,
  getPages: Actions.getPages,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteDisplay);
