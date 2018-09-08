import React, { Component } from "react";
import { connect } from "react-redux";
import { HotKeys } from "react-hotkeys";
import {
  Icon,
  Grid,
  Button,
  Menu,
  Dropdown,
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
import Editor from "./ScratchpadDisplay/components/Editor/Editor";

import * as CommonActions from "../../commonActions";
import "./SprintPage.css";

import { updateSprintQuote } from "../../utils/api";

class SprintDisplay extends Component {
  state = {
    issueList: [],
    display: "scratchpad",
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

  overrideMousetrap(HotKeys) {
    //define previous stopCallback handler for mousetrap
    HotKeys.__mousetrap__.stopCallback = function(e, element, combo) {
      // if the element has the class "mousetrap" then no need to stop
      if ((" " + element.className + " ").indexOf(" mousetrap ") > -1) {
        return false;
      }
      // stop for input, select, and textarea
      return (
        element.tagName === "INPUT" ||
        element.tagName === "SELECT" ||
        element.tagName === "TEXTAREA" ||
        (element.contentEditable && element.contentEditable === "true")
      );
    };
  }

  keyMap = {
    changeToIssues: "1",
    changeToGraphs: "2",
    changeToTimelogs: "3",
    changeToScratchpad: "4",
    changeToCalendar: "5",
  };

  handlers = {
    changeToIssues: () => this.setState({ display: "issue" }),
    changeToGraphs: () => this.setState({ display: "graph" }),
    changeToTimelogs: () => this.setState({ display: "timelog" }),
    changeToScratchpad: () => this.setState({ display: "scratchpad" }),
    changeToCalendar: () => this.setState({ display: "calendar" }),
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
      <HotKeys
        keyMap={this.keyMap}
        handlers={this.handlers}
        ref={this.overrideMousetrap}
      >
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
                      <div onClick={this.toggleEditSprintQuote}>
                        {quote || selectedSprint.quote || "no quote"}
                      </div>
                    )}
                  </Header.Subheader>
                </Header>
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={6}>
              <Container />
            </Grid.Column>
            <Grid.Column width={6}>
              <Container>
                <Menu pointing compact style={{ float: "right" }}>
                  <Menu.Item
                    name="issue"
                    active={display === "issue"}
                    onClick={() => this.setState({ display: "issue" })}
                  />
                  <Menu.Item
                    name="graph"
                    active={display === "graph"}
                    onClick={() => this.setState({ display: "graph" })}
                  />
                  <Menu.Item
                    name="timelog"
                    active={display === "timelog"}
                    onClick={() => this.setState({ display: "timelog" })}
                  />
                  <Menu.Item
                    name="scratchpad"
                    active={display === "scratchpad"}
                    onClick={() => this.setState({ display: "scratchpad" })}
                  />
                  <Menu.Item
                    name="calendar"
                    active={display === "calendar"}
                    onClick={() => this.setState({ display: "calendar" })}
                  />
                </Menu>
              </Container>
            </Grid.Column>
          </Grid>
          <Divider />

          {displayComponent}

          <Editor
            sprintScratchpad
            autoSize
            id={selectedSprint.id}
            content={selectedSprint.notes}
          />
        </div>
      </HotKeys>
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
