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
    this.props.getScratchpads(
      this.props.pages && this.props.pages.length > 0
        ? this.props.pages[0].id
        : -1
    );
    this.setState({
      selectedPage:
        this.props.pages && this.props.pages.length > 0 && this.props.pages[0],
    });
  }

  componentDidUpdate(prevProps) {
    const { pages } = this.props;
    if (JSON.stringify(prevProps.pages) !== JSON.stringify(pages)) {
      this.props.getScratchpads(this.props.pages ? this.props.pages[0].id : 0);
      this.setState({ selectedPage: this.props.pages && this.props.pages[0] });
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

  renderPage = page => {
    const { selectedPage } = this.state;
    return (
      <Menu.Item
        name={page.name}
        active={selectedPage && selectedPage.id === page.id}
        key={page.id}
        onClick={() => {
          if (
            JSON.stringify(page) !== JSON.stringify(this.state.selectedPage)
          ) {
            this.props.getScratchpads(page.id);
            this.setState({ selectedPage: page });
          }
        }}
      />
    );
  };

  render() {
    const { scratchpads, pages } = this.props;
    const { selectedPage } = this.state;

    if (!scratchpads) {
      return <Loader active inline />;
    }

    return (
      <div>
        <Menu pointing>
          {pages && pages.map(page => this.renderPage(page))}
        </Menu>
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
        <ArchiveModal scratchpads={scratchpads} />
        <PageModal />
        <Button
          floated="right"
          labelPosition="left"
          icon
          onClick={() => this.props.archivePage(selectedPage.id)}
          color="black"
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
  createScratchpad: Actions.createScratchpad,
  createPage: Actions.createPage,
  archivePage: Actions.archivePage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScratchpadDisplay);
