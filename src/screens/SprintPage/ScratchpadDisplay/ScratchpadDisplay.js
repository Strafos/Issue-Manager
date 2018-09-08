import React, { Component } from "react";
import { Loader, Grid, Menu, Button, Icon } from "semantic-ui-react";
import { connect } from "react-redux";

import Editor from "./components/Editor/Editor";

import * as Actions from "../sprintPageActions";
import ArchiveModal from "./components/ArchiveModal/ArchiveModal";
import PageModal from "./components/PageModal/PageModal";

class ScratchpadDisplay extends Component {
  state = {};

  componentDidMount() {
    // this.setState({
    //   selectedPage: this.props.pages && this.props.pages[0],
    // });
    this.props.getScratchpads(this.props.pages ? this.props.pages[0].id : 0);
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

  renderPage = page => {
    return (
      <Button
        onClick={() => {
          this.props.getScratchpads(page.id);
          this.setState({ selectedPage: page });
        }}
        color="black"
        key={page.id}
      >
        {page.name}
      </Button>
    );
  };

  render() {
    const { scratchpads, pages } = this.props;
    console.log(this.state.selectedPage);

    if (!scratchpads) {
      return <Loader active inline />;
    }

    return (
      <div>
        <Button.Group>
          {pages && pages.map(page => this.renderPage(page))}
        </Button.Group>
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
  pages: state.sprintPage.pages.data,
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
