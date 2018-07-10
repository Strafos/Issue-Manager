import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class SprintDropDown extends Component {
  state = {
    defaultVal: 0
  };

  sprintOptions = sprints =>
    sprints.map(sprint => {
      return {
        text: sprint.name,
        key: sprint.id,
        value: sprint.id
      };
    });

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     defaultVal: nextProps.defaultVal
  //   });
  // }

  render() {
    // const { defaultVal } = this.state;
    const { sprints, onChange, simple, defaultVal } = this.props;
    return (
      <Dropdown
        placeholder="Select Sprint"
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
