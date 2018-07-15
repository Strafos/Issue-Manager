export const createSprint = async requestObj => {
  const response = await fetch("/createSprint", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestObj)
  });
  const body = await response.json();

  if (response.status !== 200) throw Error(body.message);

  return body;
};

export const createIssue = async requestObj => {
  const response = await fetch("/createIssue", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestObj)
  });

  return await response;
};

export const createProject = async requestObj => {
  const response = await fetch("/createProject", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestObj)
  });

  return await response;
};

export const getSprints = () => {
  return fetch("/getSprints", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
};

export const getProjects = () => {
  return fetch("/getProjects", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
};

export const getSprint = id => {
  return fetch(`/getSprint/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
};

export const addRecentIssue = (id, name) => {
  return fetch(`/recent_issue/${id}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name })
  }).then(response => {
    return response;
  });
};

export const getRecentIssues = () => {
  return fetch(`/recent_issues`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
};

export const getIssue = id => {
  return fetch(`/getIssue/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
};

export const setStatus = (id, status) => {
  console.log(status);
  return fetch(`/setStatus/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  }).then(response => {
    return response.json();
  });
};

export const setBlocked = (id, blocked) => {
  return fetch(`/setBlocked/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ blocked })
  }).then(response => {
    return response.json();
  });
};

export const setTime = (id, stat, time) => {
  return fetch(`/setTime/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ stat, time })
  }).then(response => {
    return response.json();
  });
};

export const updateNotes = (notes, id) => {
  return fetch(`/updateNotes/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ notes })
  }).then(response => {
    return response.json();
  });
};

export const updateIssue = (requestObj, id) => {
  console.log(requestObj);
  return fetch(`/issue/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestObj)
  }).then(response => {
    return response.json();
  });
};

export const deleteIssue = id => {
  return fetch(`/issue/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
};

export default {
  createSprint,
  createIssue,
  createProject,
  getSprints,
  getSprint,
  getProjects,
  getIssue,
  setStatus,
  updateNotes,
  updateIssue
};
