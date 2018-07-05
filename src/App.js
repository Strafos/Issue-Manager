import React, { Component } from "react";
import "./App.css";
import { Button, Modal, Dropdown, Form } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

import SprintModal from "./components/SprintModal/SprintModal";
import SprintDropDown from "./components/SprintDropDown/SprintDropDown";

// import { createSprint, foo } from "./utils/api/api";
import getSprints from "./utils/api/api";

class App extends Component {
  state = {
    sprints: [],
    selectedSprint: null
  };

  handleSprintSelect = (event, { value }) => {
    this.setState({
      selectedSprint: value
    });
  };

  componentDidMount() {
    getSprints().then(sprints => this.setState({ sprints }));
  }

  render() {
    const { sprints, selectedSprint } = this.state;
    console.log(selectedSprint);

    return (
      <div className="App">
        <SprintModal />
        <SprintDropDown sprints={sprints} onChange={this.handleSprintSelect} />
      </div>
    );
  }
}

export default App;
