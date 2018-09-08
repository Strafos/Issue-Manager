export const getAllScratchpads = () => {
  return fetch("/Scratchpads", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const getScratchpads = page => {
  return fetch(`/Scratchpads/${page}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const setScratchpad = (id, content) => {
  return fetch(`/Scratchpad/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  }).then(response => {
    return response.json();
  });
};

export const archiveScratchpad = (id, content, title) => {
  return fetch(`/Scratchpad/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, title, archived: 1 }),
  }).then(response => {
    return response.json();
  });
};

export const createScratchpad = () => {
  return fetch("/Scratchpad", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};
