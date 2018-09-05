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
          <Editor content={scratchpads[0].content} id={scratchpads[0].id} />
          <Editor content={scratchpads[2].content} id={scratchpads[2].id} />
        </Grid.Column>
        <Grid.Column>
          <Editor content={scratchpads[1].content} id={scratchpads[1].id} />
          <Editor content={scratchpads[3].content} id={scratchpads[3].id} />
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
