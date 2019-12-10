import React, { Component } from "react";
import "./TodoList.css";
import { Menu, Input, Checkbox, Segment } from "semantic-ui-react";

import "react-datepicker/dist/react-datepicker.css";

import { getTodos, addTodo, finishTodo } from "../../utils/api";

class TodoList extends Component {
  state = {
    todoList: [],
    newTodo: "",
  };

  renderTodo = todo => {
    return (
      <Menu.Item key={todo.id} position="left">
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
            <Menu.Header>TODOs</Menu.Header>
          </Segment>
          <Menu.Menu>
            {todoList && todoList.map(todo => this.renderTodo(todo))}
          </Menu.Menu>
        </Menu>
        {/* <Input
          style={{ color: "black" }}
          placeholder="Add todo..."
          action={{
            icon: "plus",
            onClick: this.handleSubmit,
          }}
          value={this.state.newTodo}
          size="small"
          onChange={this.handleInput}
        /> */}
      </div>
    );
  }
}

export default TodoList;
