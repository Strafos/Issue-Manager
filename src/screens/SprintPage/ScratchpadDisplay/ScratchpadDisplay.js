import React, { Component } from "react";
import { Loader, Grid, Menu, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./components/Editor/Editor";

import * as Actions from "../sprintPageActions";
import ArchiveModal from "./components/ArchiveModal/ArchiveModal";
import PageModal from "./components/PageModal/PageModal";

class ScratchpadDisplay extends Component {
  componentDidMount() {
    this.props.getScratchpads();
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
    const { scratchpads } = this.props;

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
        <PageModal />
        <Button
          floated="left"
          labelPosition="left"
          icon
          onClick={this.props.createScratchpad}
          color="black"
        >
          New Scratchpad
          <Icon color="red" name="plus" />
        </Button>
        <ArchiveModal scratchpads={scratchpads} />
        <br />
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scratchpads: state.sprintPage.scratchpads.data,
});

const mapDispatchToProps = {
  getScratchpads: Actions.getScratchpads,
  createScratchpad: Actions.createScratchpad,
  createPage: Actions.createPage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScratchpadDisplay);
