export const createIssue = async requestObj => {
  return fetch("/Issue", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  }).then(response => {
    return response.json();
  });
};

export const getIssue = id => {
  return fetch(`/Issue/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const setStatus = (id, status) => {
  return fetch(`/Issue/${id}/status`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  }).then(response => {
    if (response.status === 500) {
      return { status: "Failed" };
    }
    return response.json();
  });
};

export const setBlocked = (id, blocked) => {
  return fetch(`/Issue/${id}/blocked`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blocked }),
  }).then(response => {
    return response.json();
  });
};

export const setTime = (id, stat, time) => {
  return fetch(`/Issue/${id}/time`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stat, time }),
  }).then(response => {
    return response.json();
  });
};

export const updateIssueNotes = (id, notes) => {
  return fetch(`/Issue/${id}/notes`, {
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

export const updateIssue = (requestObj, id) => {
  return fetch(`/Issue/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  }).then(response => {
    return response.json();
  });
};

export const deleteIssue = id => {
  return fetch(`/Issue/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const updateShowNotes = (id, bool) => {
  return fetch(`/Issue/${id}/showNotes`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bool }),
  }).then(response => {
    return response.json();
  });
};
