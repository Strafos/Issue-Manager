// API calls
// server.js: API endpoints
// database.js: sqlite3 interface

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

export const createIssue = async requestObj => {
  const response = await fetch("/issue", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  });

  return await response;
};

export const createTimeLog = async requestObj => {
  const response = await fetch("/log", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  });

  return await response;
};

export const getTimeLogs = sprintId => {
  return fetch(`/log/${sprintId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const createProject = async requestObj => {
  const response = await fetch("/project", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  });

  return await response;
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

export const getProjects = () => {
  return fetch("/projects", {
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
  return fetch(`/Sprint/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const addRecentIssue = (id, name) => {
  return fetch(`/recentIssue/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  }).then(response => {
    return response.json();
  });
};

export const getRecentIssues = () => {
  return fetch(`/recentIssues`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
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
  return fetch(`/issue/${id}/status`, {
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
  return fetch(`/issue/${id}/blocked`, {
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
  return fetch(`/issue/${id}/time`, {
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

export const updateIssueNotes = (id, notes) => {
  return fetch(`/issue/${id}/notes`, {
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
  return fetch(`/issue/${id}`, {
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
  return fetch(`/issue/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const deleteLog = id => {
  return fetch(`/timelog/${id}`, {
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
  return fetch(`/issue/${id}/showNotes`, {
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

export default {
  createSprint,
  createIssue,
  createProject,
  createTimeLog,
  getSprints,
  getSprint,
  getProjects,
  getIssue,
  setStatus,
  updateSprintNotes,
  updateIssueNotes,
  updateIssue,
  updateShowNotes,
  updateSprintQuote,
};
