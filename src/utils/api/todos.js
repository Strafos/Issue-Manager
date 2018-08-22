export const getTodos = () => {
  return fetch(`/Todos`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const finishTodo = id => {
  return fetch(`/Todos/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const addTodo = todoName => {
  return fetch(`/Todos`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todoName }),
  }).then(response => {
    return response.json();
  });
};
