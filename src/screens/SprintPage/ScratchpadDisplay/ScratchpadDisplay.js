import React, { Component } from "react";
import { Loader, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./Editor";

import * as Actions from "../sprintPageActions";

class ScratchpadDisplay extends Component {
  componentDidMount() {
    this.props.getScratchpads();
  }

  render() {
    const { scratchpads } = this.props;

    if (!scratchpads) {
      return <Loader active inline />;
    }

    return (
      <Grid divided columns={2}>
        <Grid.Column>
          <Editor data={scratchpads[0]} />
          <Editor data={scratchpads[2]} />
        </Grid.Column>
        <Grid.Column>
          <Editor data={scratchpads[1]} />
          <Editor data={scratchpads[3]} />
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
