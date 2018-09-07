import React, { Component } from "react";
import { Loader, Grid } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./Editor";
import "./ScratchpadDisplay.css";

import * as Actions from "../sprintPageActions";

class ScratchpadDisplay extends Component {
  componentDidMount() {
    this.props.getScratchpads();
  }

  renderEditor = scratchpad => {
    return <Editor content={scratchpad.content} id={scratchpad.id} />;
  };

  render() {
    const { scratchpads } = this.props;

    if (!scratchpads) {
      return <Loader active inline />;
    }

    const half = Math.ceil(scratchpads.length / 2);

    return (
      <div>
        <Grid columns={2}>
          <Grid.Column style={{ paddingRight: 5 }}>
            {scratchpads
              .slice(0, half)
              .map(scratchpad => this.renderEditor(scratchpad))}
          </Grid.Column>
          <Grid.Column style={{ paddingLeft: 5 }}>
            {scratchpads
              .slice(half, scratchpads.length)
              .map(scratchpad => this.renderEditor(scratchpad))}
          </Grid.Column>
        </Grid>
      </div>
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
