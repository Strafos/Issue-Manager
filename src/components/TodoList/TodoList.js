import React, { Component } from "react";
import "./TodoList.css";
import {
  Menu,
  Container,
  Icon,
  Input,
  Checkbox,
  Divider,
  Segment,
} from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

import { getTodos, addTodo, finishTodo } from "../../utils/api/api";

class TodoList extends Component {
  state = {
    todoList: [],
    newTodo: "",
  };

  renderTodo = todo => {
    return (
      <Menu.Item position="left">
        <Checkbox
          onClick={() => this.handleFinishTodo(todo.id)}
          checked={false}
          label={todo.name}
        />
      </Menu.Item>
    );
  };

  componentDidMount() {
    getTodos().then(todoList => {
      this.setState({
        todoList,
      });
    });
  }

  handleFinishTodo = id => {
    finishTodo(id).then(() => {
      getTodos().then(todoList => {
        this.setState({
          todoList,
        });
      });
    });
  };

  handleSubmit = () => {
    const { newTodo } = this.state;
    addTodo(newTodo).then(() => {
      getTodos().then(todoList => {
        this.setState({
          todoList,
        });
      });
    });
    this.setState({
      newTodo: "",
    });
  };

  handleInput = (event, data) => {
    this.setState({
      newTodo: data.value,
    });
  };

  render() {
    const { todoList } = this.state;

    return (
      <div className="center">
        <Menu vertical>
          <Segment size="mini">
            <Menu.Header verticalAlign="middle">TODOs</Menu.Header>
          </Segment>
          <Menu.Menu>
            {todoList && todoList.map(todo => this.renderTodo(todo))}
          </Menu.Menu>
        </Menu>
        <Input
          placeholder="Add todo..."
          action={{
            icon: "plus",
            onClick: this.handleSubmit,
          }}
          value={this.state.newTodo}
          size="small"
          onChange={this.handleInput}
          inverted
        />
      </div>
    );
  }
}

export default TodoList;
