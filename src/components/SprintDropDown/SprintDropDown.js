import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

class SprintDropDown extends Component {
  renderItem = sprint => {
    const { link } = this.props;
    return (
      <Dropdown.Item
        as={link && Link}
        to={`/sprint/${sprint.id}`}
        text={sprint.name}
        key={sprint.id}
        value={sprint.id}
        onClick={this.props.onChange}
      />
    );
  };

  render() {
    const { sprints, onChange, simple, value } = this.props;

    return (
      <Dropdown
        placeholder="Select Sprint"

        // This prints an error to console, I need it for the dropdown to look nice
        // GRRR
        selection

        value={value}
        item
        simple={simple}
        onChange={onChange}
      >
        <Dropdown.Menu>
          {sprints
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
            .map(sprint => this.renderItem(sprint))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default SprintDropDown;
