import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

class SprintDropDown extends Component {
  sprintOptions = sprints =>
    sprints.map(sprint => {
      return {
        text: sprint.name,
        key: sprint.id,
        value: sprint.id,
      };
    });

  renderItem = sprint => {
    return (
      <Dropdown.Item
        as={Link}
        to={`/sprint/${sprint.id}`}
        text={sprint.name}
        key={sprint.id}
        value={sprint.id}
      />
    );
  };

  render() {
    const { sprints, onChange, simple, value } = this.props;
    return (
      <Dropdown
        placeholder="Select Sprint"
        selection
        value={value}
        item
        simple={simple}
        onChange={onChange}
      >
        <Dropdown.Menu>
          {sprints.map(sprint => this.renderItem(sprint))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default SprintDropDown;
