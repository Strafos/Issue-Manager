import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

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
    const { sprints, onChange, defaultVal, simple } = this.props;
    return (
      <Dropdown
        placeholder="Select Sprint"
        // search
        selection
        defaultValue={defaultVal}
        item
        simple={simple}
        onChange={onChange}
        options={this.sprintOptions(sprints)}
      />
    );
  }
}

export default SprintDropDown;
