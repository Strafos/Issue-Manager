import React, { Component } from "react";
import { Loader, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./Editor";

import * as Actions from "../sprintPageActions";

class ScratchpadDisplay extends Component {
  state = {};

  componentDidMount() {
    const { selectedSprint, issues } = this.props;
    this._loadData(selectedSprint, issues);
  }

  componentDidUpdate(prevProps) {
    const { selectedSprint } = this.props;
    if (selectedSprint.id !== prevProps.selectedSprint.id) {
      this._loadData(selectedSprint);
    }
  }

  _loadData = selectedSprint => {
    this.props.getScratchpads();
  };

  render() {
    const { scratchpads } = this.props;

    if (!scratchpads) {
      return <Loader active inline />;
    }

    return (
      <Grid divided columns={2}>
        <Grid.Column>
          <Editor data={scratchpads[0]} />
        </Grid.Column>
        <Grid.Column>
          <Editor data={scratchpads[1]} />
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  scratchpads: state.sprintPage.scratchpads.data,
});

const mapDispatchToProps = {
  getScratchpads: Actions.getScratchpads,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScratchpadDisplay);
