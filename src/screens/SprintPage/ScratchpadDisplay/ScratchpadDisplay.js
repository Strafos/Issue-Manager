import React, { Component } from "react";
import { Loader, Grid, Button, Icon } from "semantic-ui-react";
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
        <Button.Group style={{ paddingTop: 0 }}>
          <Button icon>
            <Icon inverted name="align left" />
          </Button>
          <Button icon>
            <Icon name="align center" />
          </Button>
          <Button icon>
            <Icon name="align right" />
          </Button>
          <Button icon>
            <Icon name="align justify" />
          </Button>
        </Button.Group>
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
