import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class SprintDropDown extends Component {
  sprintOptions = sprints =>
    sprints.map(sprint => {
      return {
        text: sprint.name,
        key: sprint.id,
        value: sprint.id,
      };
    });

  render() {
    const { sprints, value, onChange } = this.props;

    return (
      <Dropdown
        placeholder="Select Sprint..."
        search
        selection
        value={value}
        onChange={onChange}
        options={this.sprintOptions(sprints)}
      />
    );
  }
}
// sprintOptions = sprints => {
//   sprints.map(sprint => {
//     return {
//       text: sprint.name,
//       key: sprint.id,
//       value: sprint.id,
//     };
//   });
// };

// render() {
//   const { sprints, onChange, value } = this.props;
//   return (
//     <Dropdown
//       placeholder="Select Sprint"
//       search
//       selection
//       // defaultValue={0}
//       value={value}
//       onChange={onChange}
//       options={this.sprintOptions(sprints)}
//     />
//   );
// }
// }

export default SprintDropDown;
