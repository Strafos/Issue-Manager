import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";

class SprintDropDown extends Component {
  renderItem = sprint => {
    return (
      <Dropdown.Item
        // as={Link}
        // to={`/sprint/${sprint.id}`}
        text={sprint.name}
        key={sprint.id}
        value={sprint.id}
        onClick={this.props.onChange}
      />
    );
  };

  render() {
    const { sprints, onChange, simple, value } = this.props;
    console.log(value);

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
          {sprints
            .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
            .map(sprint => this.renderItem(sprint))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default SprintDropDown;
