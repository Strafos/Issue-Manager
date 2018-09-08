import React, { Component } from "react";
import { Loader, Grid, Menu, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./Editor";

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
        <br />
        <Button
          floated="left"
          labelPosition="left"
          icon
          onClick={this.props.createScratchpad}
          color="black"
        >
          New Page
          <Icon color="red" name="plus" />
        </Button>
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
        <Button
          floated="left"
          labelPosition="left"
          icon
          onClick={this.handleOpen}
          color="black"
        >
          Archive
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
});

const mapDispatchToProps = {
  getScratchpads: Actions.getScratchpads,
  createScratchpad: Actions.createScratchpad,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScratchpadDisplay);
