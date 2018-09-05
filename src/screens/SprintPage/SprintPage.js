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

import * as CommonActions from "../../commonActions";

import { updateSprintNotes, updateSprintQuote } from "../../utils/api";

class SprintDisplay extends Component {
  state = {
    issueList: [],
    displayTimelogs: false,
    displayGraphs: false,
    displayScratchpad: false,
    displayCalendar: false,
    displayIssues: true,
    notes: "",
    quote: "",
    editQuote: false,
    isSprintNoteSaving: false,
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

      // Default to sprint notes when sprint changes
      this.setState({
        notes: null,
      });
    }
  }

  handleSprintNotes = (event, { value }) => {
    this.setState({
      notes: value,
    });
  };

  handleSaveSprintNotes = () => {
    const { selectedSprint } = this.props;
    const { notes } = this.state;

    this.setState({ isSprintNoteSaving: true });
    updateSprintNotes(notes || selectedSprint.notes, selectedSprint.id).then(
      res => {
        if (!res || res.status !== "Success") {
          this.props.error("Failed to save notes");
        } else {
          this.setState({ isSprintNoteSaving: false });
        }
      }
    );
  };

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

  renderTextArea = () => {
    const { selectedSprint } = this.props;
    return (
      <TextArea
        onChange={this.handleSprintNotes}
        style={{
          minHeight: 350,
          backgroundColor: "#282828",
          color: "#BEBEBE",
          fontSize: 17,
        }}
        placeholder="Sprint notes..."
        value={this.state.notes || selectedSprint.notes}
      />
    );
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
    const {
      editQuote,
      quote,
      displayTimelogs,
      displayGraphs,
      displayScratchpad,
      displayCalendar,
      isSprintNoteSaving,
      isSaving,
    } = this.state;
    const { projectList, sprintList, issueList, selectedSprint } = this.props;

    if (!selectedSprint) {
      return <Loader active inline />;
    }

    let display;
    if (displayTimelogs) {
      display = (
        <TimelogDisplay sprintId={selectedSprint && selectedSprint.id} />
      );
    } else if (displayGraphs) {
      display = (
        <GraphDisplay selectedSprint={selectedSprint} issueList={issueList} />
      );
    } else if (displayScratchpad) {
      display = <ScratchpadDisplay />;
    } else if (displayCalendar) {
      display = <CalendarDisplay />;
    } else {
      display = (
        <IssueDisplay
          issueList={issueList}
          selectedSprint={selectedSprint}
          projects={projectList}
          sprints={sprintList}
          issues={issueList}
          saving={this.setSaving}
        />
      );
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
                onClick={() =>
                  this.setState({
                    displayGraphs: false,
                    displayTimelogs: false,
                    displayScratchpad: false,
                    displayCalendar: false,
                  })
                }
                color="black"
                floated="left"
              >
                {"Issues"}
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    displayGraphs: true,
                    displayTimelogs: false,
                    displayScratchpad: false,
                    displayCalendar: false,
                  })
                }
                color="black"
                floated="left"
              >
                {"Graphs"}
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    displayGraphs: false,
                    displayTimelogs: true,
                    displayScratchpad: false,
                    displayCalendar: false,
                  })
                }
                color="black"
                floated="left"
              >
                {"Timelogs"}
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    displayGraphs: false,
                    displayTimelogs: false,
                    displayScratchpad: true,
                    displayCalendar: false,
                  })
                }
                color="black"
                floated="left"
              >
                {"Scratchpad"}
              </Button>
              <Button
                onClick={() =>
                  this.setState({
                    displayGraphs: false,
                    displayTimelogs: false,
                    displayScratchpad: false,
                    displayCalendar: true,
                  })
                }
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

        {display}

        {true && (
          // {!displayScratchpad && (
          <div>
            <Form>
              <Form.Field control={this.renderTextArea} label="Sprint Notes" />
            </Form>
            <br />
            <div>
              <Button
                floated="left"
                color="red"
                onClick={this.handleSaveSprintNotes}
              >
                Save notes
              </Button>
              <Icon
                style={{
                  position: "relative",
                  left: "10px",
                  top: "8px",
                  float: "left",
                }}
                loading={isSprintNoteSaving}
                name={isSprintNoteSaving ? "redo" : "check"}
              />
            </div>
          </div>
        )}
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
