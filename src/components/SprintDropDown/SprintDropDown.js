import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

class SprintDropDown extends Component {
  sprintOptions = sprints =>
    sprints.map(sprint => {
      return {
        text: sprint.name,
        key: sprint.id,
        value: sprint.id
      };
    });

  render() {
    const { sprints, onChange } = this.props;
    return (
      <Dropdown
        placeholder="Select Sprint"
        search
        selection
        onChange={onChange}
        options={this.sprintOptions(sprints)}
      />
    );
  }
}

export default SprintDropDown;
