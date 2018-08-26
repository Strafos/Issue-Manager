import React, { Component } from "react";
import { Loader, Grid } from "semantic-ui-react";

import Editor from "./Editor";

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

  _loadData = selectedSprint => {};

  render() {
    const { selectedSprint } = this.props;

    if (!selectedSprint) {
      return <Loader active inline />;
    }

    return (
      <Grid divided columns={2}>
        <Grid.Column>
          <Editor />
        </Grid.Column>
        <Grid.Column>
          <Editor />
        </Grid.Column>
      </Grid>
    );
  }
}

export default ScratchpadDisplay;
