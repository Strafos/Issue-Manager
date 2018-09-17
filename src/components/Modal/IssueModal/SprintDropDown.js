import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";
import { connect } from "react-redux";

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
    console.log(sprints);

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

const mapStateToProps = state => ({
  sprints: state.commonData.sprintList.data,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SprintDropDown);
