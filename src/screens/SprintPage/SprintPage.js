import React, { Component } from "react";
import { connect } from "react-redux";

import "./SprintPage.css";
import {
  Icon,
  Grid,
  Button,
  Form,
  TextArea,
  Header,
  Container,
  Loader,
  Divider,
} from "semantic-ui-react";

import GraphDisplay from "./GraphDisplay/GraphDisplay";
import TimelogDisplay from "./TimelogDisplay/TimelogDisplay";
import IssueDisplay from "./IssueDisplay/IssueDisplay";
import ScratchpadDisplay from "./ScratchpadDisplay/ScratchpadDisplay";
import CalendarDisplay from "./CalendarDisplay/CalendarDisplay";
import Editor from "./ScratchpadDisplay/Editor";

import * as CommonActions from "../../commonActions";

import { updateSprintQuote } from "../../utils/api";

class SprintDisplay extends Component {
  state = {
    issueList: [],
    display: "issue",
    quote: "",
    editQuote: false,
    isSaving: false,
  };

  componentDidMount() {
    const { match } = this.props;
    this.props.getSprintIssues(match.params.id);
    this.props.getSprint(match.params.id);
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
    this.setSaving(true);
    updateSprintQuote(quote || selectedSprint.quote, selectedSprint.id).then(
      res => {
        if (!res || res.status !== "Success") {
          this.props.error("Failed to save quote");
        } else {
          this.setSaving(false);
        }
      }
    );
  };

  setSaving = saveState => {
    this.setState({
      isSaving: saveState,
    });
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

  renderName = (name, id) => (
    <div>
      {name}
      <a href={`/issue/${id}`}>
        <Icon color="red" className="super" name="plus" size="small" />
      </a>
    </div>
  );

  render() {
    const { editQuote, quote, display } = this.state;
    const { projectList, sprintList, issueList, selectedSprint } = this.props;

    if (!selectedSprint) {
      return <Loader active inline />;
    }

    let displayComponent;
    switch (display) {
      case "graph":
        displayComponent = (
          <GraphDisplay selectedSprint={selectedSprint} issueList={issueList} />
        );
        break;
      case "timelog":
        displayComponent = (
          <TimelogDisplay sprintId={selectedSprint && selectedSprint.id} />
        );
        break;
      case "scratchpad":
        displayComponent = <ScratchpadDisplay />;
        break;
      case "calendar":
        displayComponent = <CalendarDisplay />;
        break;
      case "issue":
        displayComponent = (
          <IssueDisplay
            issueList={issueList}
            selectedSprint={selectedSprint}
            projects={projectList}
            sprints={sprintList}
            issues={issueList}
            saving={this.setSaving}
          />
        );
        break;
      default:
        displayComponent = null;
    }

    return (
      <div>
        <Grid verticalAlign="top" columns={2} stretched>
          <Grid.Column textAlign="left" width={7}>
            <Grid.Row>
              <Header floated="left" as="h1">
                {selectedSprint && selectedSprint.name}
                <Header.Subheader>
                  {/* <Icon
                    style={{
                      position: "relative",
                      left: "280px",
                      top: "20px",
                    }}
                    loading={isSaving}
                    name={isSaving ? "redo" : "check"}
                  /> */}
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
                    <Container onClick={this.toggleEditSprintQuote}>
                      {quote || selectedSprint.quote || "no quote"}
                    </Container>
                  )}
                </Header.Subheader>
              </Header>
            </Grid.Row>
            <Divider />
            <Grid.Row>
              <Button
                onClick={() => this.setState({ display: "issue" })}
                color="black"
                floated="left"
              >
                {"Issues"}
              </Button>
              <Button
                onClick={() => this.setState({ display: "graph" })}
                color="black"
                floated="left"
              >
                {"Graphs"}
              </Button>
              <Button
                onClick={() => this.setState({ display: "timelog" })}
                color="black"
                floated="left"
              >
                {"Timelogs"}
              </Button>
              <Button
                onClick={() => this.setState({ display: "scratchpad" })}
                color="black"
                floated="left"
              >
                {"Scratchpad"}
              </Button>
              <Button
                onClick={() => this.setState({ display: "calendar" })}
                color="black"
                floated="left"
              >
                {"Calendar"}
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={9}>
            <Container />
          </Grid.Column>
        </Grid>

        {displayComponent}

        <Editor
          sprintScratchpad
          autoSize
          id={selectedSprint.id}
          content={selectedSprint.notes}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sprintList: state.commonData.sprintList.data,
  issueList: state.commonData.sprintIssues.data,
  selectedSprint: state.commonData.sprint.data && state.commonData.sprint.data,
  projectList: state.commonData.projects.data || [],
});

const mapDispatchToProps = {
  getSprintIssues: CommonActions.getSprintIssues,
  getSprint: CommonActions.getSprint,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintDisplay);
