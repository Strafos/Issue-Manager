import React, { Component } from "react";
import "./RecentMenu.css";
import { Menu, Container, Button } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

class RecentMenu extends Component {
  renderSprints = sprint => {
    const { selectedSprint } = this.props;
    return (
      <Menu.Item
        key={sprint.id}
        content={sprint.name}
        index={sprint.id}
        active={selectedSprint && selectedSprint.name === sprint.name}
        onClick={this.props.handleSprintMenuClick}
        href={`/sprint/${sprint.id}`}
      />
    );
  };

  renderIssue = issue => {
    const { selectedIssue } = this.props;
    return (
      <Menu.Item
        key={issue.issue_id}
        content={issue.name}
        index={issue.issue_id}
        active={selectedIssue && selectedIssue == issue.issue_id}
        onClick={this.props.handleIssueMenuClick}
        href={`/issue/${issue.issue_id}`}
      />
    );
  };

  render() {
    const { sprints, recentIssues } = this.props;

    sprints.sort((a, b) => {
      return new Date(a.start_date) - new Date(b.start_date);
    });

    const len = sprints.length;

    return (
      <div className="center">
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>Recent Sprints</Menu.Header>

            <Menu.Menu>
              {sprints
                .slice(len - 3, len)
                .map(sprint => this.renderSprints(sprint))}
            </Menu.Menu>
          </Menu.Item>
        </Menu>
        {/* <Menu vertical>
          <Menu.Item>
            <Menu.Header>Recent Issues</Menu.Header>

            <Menu.Menu>
              {recentIssues &&
                recentIssues.map(issue => this.renderIssue(issue))}
            </Menu.Menu>
          </Menu.Item>
        </Menu> */}
      </div>
    );
  }
}

export default RecentMenu;
