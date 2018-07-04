import React, { Component } from "react";
import "./App.css";
import { Button, Modal, Input, Form } from "semantic-ui-react";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

import SprintModal from "./components/SprintModal/SprintModal";

class App extends Component {
  state = {
    sprints: []
  };

  render() {
    return (
      <div className="App">
        <SprintModal />
      </div>
    );
  }
}

export default App;
