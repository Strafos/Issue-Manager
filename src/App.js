import React, { Component } from "react";
import "./App.css";
import { Button, Modal, Header } from "semantic-ui-react";
import { DatePicker } from "react-datepicker";

class App extends Component {

  const foo = 5;

  render() {
    return (
      <div className="App">
        <Modal trigger={<Button primary>Create new sprint</Button>}>
          <Modal.Header>Create Sprint</Modal.Header>
          <Modal.Content>
            <DatePicker
              selected={this.state.startDate}
              onChange={this.handleChange}
            />
            <Modal.Description>
              <Header>Default Profile Image</Header>
              <p>
                We've found the following gravatar image associated with your
                e-mail address.
              </p>
              <p>Is it okay to use this photo?</p>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default App;
