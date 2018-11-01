import React, { Component } from "react";
import { Loader, Grid, Menu, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./components/Editor/Editor";

import * as Actions from "../sprintPageActions";
import ArchiveModal from "./components/ArchiveModal/ArchiveModal";
import RestoreModal from "./components/RestoreModal/RestoreModal";
import PageModal from "./components/PageModal/PageModal";

class ScratchpadDisplay extends Component {
  state = {};

  componentDidMount() {
    const { selectedPage } = this.props;
    if (selectedPage.id === "archive") {
      this.props.getArchivedScratchpads();
    } else {
      this.props.getScratchpads(selectedPage.id);
    }
  }

  componentDidUpdate(prevProps) {
    const { selectedPage } = this.props;
    if (selectedPage.id !== prevProps.selectedPage.id) {
      if (selectedPage.id === "archive") {
        this.props.getArchivedScratchpads();
      } else {
        this.props.getScratchpads(selectedPage.id);
      }
    }
  }

  renderEditor = scratchpad => {
    return (
      <Editor
        key={scratchpad.id}
        content={scratchpad.content}
        id={scratchpad.id}
      />
    );
  };

  render() {
    const { scratchpads, selectedPage } = this.props;

    if (!scratchpads) {
      return <Loader active inline />;
    }

    return (
      <div>
        <Grid columns={2}>
          <Grid.Column style={{ paddingRight: 5 }}>
            {scratchpads.map(
              (scratchpad, idx) =>
                idx % 2 === 0 ? this.renderEditor(scratchpad) : null
            )}
          </Grid.Column>
          <Grid.Column style={{ paddingLeft: 5 }}>
            {scratchpads.map(
              (scratchpad, idx) =>
                idx % 2 === 1 ? this.renderEditor(scratchpad) : null
            )}
          </Grid.Column>
        </Grid>
        <br />
        <Button
          floated="left"
          labelPosition="left"
          icon
          onClick={() => this.props.createScratchpad(selectedPage.id)}
          color="black"
        >
          New Scratchpad
          <Icon color="red" name="plus" />
        </Button>
        <ArchiveModal selectedPage={selectedPage} scratchpads={scratchpads} />
        {selectedPage === "archive" && (
          <RestoreModal selectedPage={selectedPage} scratchpads={scratchpads} />
        )}
        <PageModal />
        <Button
          floated="right"
          labelPosition="left"
          icon
          onClick={() => this.props.archivePage(selectedPage.id, 1)}
          color="black"
          disabled={selectedPage === "archive"}
        >
          Archive Page
          <Icon color="red" name="trash" />
        </Button>
        <br />
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scratchpads: state.sprintPage.scratchpads.data,
  pages: state.sprintPage.pages.data,
});

const mapDispatchToProps = {
  getScratchpads: Actions.getScratchpads,
  getArchivedScratchpads: Actions.getArchivedScratchpads,
  createScratchpad: Actions.createScratchpad,
  createPage: Actions.createPage,
  archivePage: Actions.archivePage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScratchpadDisplay);
