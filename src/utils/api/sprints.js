export const createSprint = async requestObj => {
  const response = await fetch("/sprint", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

export const getSprints = () => {
  return fetch("/sprints", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const getSprintIssues = id => {
  return fetch(`/sprint/${id}/issues`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const getSprint = id => {
  return fetch(`/sprint/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const updateSprintNotes = (notes, id) => {
  return fetch(`/sprint/${id}/notes`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ notes }),
  }).then(response => {
    return response.json();
  });
};

export const updateSprintQuote = (quote, id) => {
  return fetch(`/sprint/${id}/quote`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quote }),
  }).then(response => {
    return response.json();
  });
};
