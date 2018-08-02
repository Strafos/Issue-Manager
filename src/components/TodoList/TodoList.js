import React, { Component } from "react";
import "./TodoList.css";
import { Menu, Container, Icon, Input, Checkbox } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

class TodoList extends Component {
  state = {
    todoList: [],
    newTodo: ""
  };

  renderTodo = todo => {
    return (
      <Menu.Item position="left">
        <Checkbox label={todo} />
        {/* content={issue.name}
        index={issue.issue_id}
        active={selectedIssue && selectedIssue == issue.issue_id}
        onClick={this.props.handleIssueMenuClick}
        href={`/issue/${issue.issue_id}`} */}
      </Menu.Item>
    );
  };

  componentDidMount() {
    const { todoList } = this.props;
    this.setState({ todoList });
  }

  handleSubmit = () => {
    const { todoList, newTodo } = this.state;
    console.log(newTodo);
    if (newTodo) {
      todoList.push(newTodo);
      this.setState({
        todoList
      });
    }
  };

  handleInput = (event, data) => {
    this.setState({
      newTodo: data.value
    });
  };

  render() {
    const { todoList } = this.state;
    console.log(todoList);

    return (
      <div className="center">
        <Menu vertical>
          <Menu.Item>
            <Menu.Header>TODOs</Menu.Header>
            <Menu.Menu>
              {todoList && todoList.map(todo => this.renderTodo(todo))}
              <Menu.Item>
                <Input
                  // icon="plus"
                  // iconPosition="left"
                  placeholder="Add todo..."
                  action={{
                    icon: "plus",
                    onClick: this.handleSubmit
                  }}
                  size="small"
                  onChange={this.handleInput}
                />
              </Menu.Item>
            </Menu.Menu>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default TodoList;
