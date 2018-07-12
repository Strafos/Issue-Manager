import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

class ProjectDropDown extends Component {
  projectOptions = projects =>
    projects.map(project => {
      return {
        text: project.name,
        key: project.id,
        value: project.id
      };
    });

  render() {
    const { projects, value, onChange } = this.props;
    return (
      <Dropdown
        placeholder="Select Project"
        search
        selection
        value={value}
        onChange={onChange}
        options={this.projectOptions(projects)}
      />
    );
  }
}

export default ProjectDropDown;
