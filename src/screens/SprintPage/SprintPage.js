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
  Progress,
  Container,
  Loader,
  Divider,
} from "semantic-ui-react";

import GraphDisplay from "./GraphDisplay/GraphDisplay";
import TimelogDisplay from "./TimelogDisplay/TimelogDisplay";
import IssueDisplay from "./IssueDisplay/IssueDisplay";

import * as CommonActions from "../../commonActions";

import { updateSprintNotes, updateSprintQuote } from "../../utils/api";

class SprintDisplay extends Component {
  state = {
    selectedSprint: null,
    issueList: [],
    displayTimelogs: false,
    displayGraphs: false,
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

  projectedProgress = () => {
    const { selectedSprint } = this.state;
    const now = new Date();
    const sprintEnd = new Date(selectedSprint && selectedSprint.end_date);
    const delta = sprintEnd - now;

    // Sprint has past, so set projected to 100%
    if (delta / 1000 / 3600 / 24 < 0) {
      return 100;
    }

    // 5hrs per weekday, 10 hours per weekend
    const dateMap = {
      1: 5,
      2: 10,
      3: 15,
      4: 20,
      5: 25,
      6: 35,
      0: 45,
    };
    return Math.round((dateMap[new Date().getDay()] / 45) * 100);
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
          <Grid.Column textAlign="left" width={4}>
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
                      {quote || selectedSprint.quote || "you idiot"}
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
                  })
                }
                color="black"
                floated="left"
              >
                {"Issues"}
              </Button>
              <Button
                onClick={() =>
                  this.setState({ displayGraphs: true, displayTimelogs: false })
                }
                color="black"
                floated="left"
              >
                {"Graphs"}
              </Button>
              <Button
                onClick={() =>
                  this.setState({ displayGraphs: false, displayTimelogs: true })
                }
                color="black"
                floated="left"
              >
                {"Timelogs"}
              </Button>
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={12}>
            <Container>
              {/* <Progress
                percent={Math.round((totalTimeSpent / 45) * 100)}
                progress
                color="black"
                size="small"
                label="Time Spent"
              />
              <Progress
                percent={Math.round(
                  (1 - totalTimeRemaining / totalTimeEstimate) * 100
                )}
                progress
                color="black"
                label="Task Progress"
                size="small"
              />
              <Progress
                percent={this.projectedProgress()}
                progress
                color="black"
                size="small"
                label="Projected"
              /> */}
            </Container>
          </Grid.Column>
        </Grid>

        {display}

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
