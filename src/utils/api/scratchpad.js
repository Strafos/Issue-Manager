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

export const getArchivedScratchpads = () => {
  return fetch(`/Scratchpads/archived`, {
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

export const archiveScratchpad = (id, content, title, archived) => {
  return fetch(`/Scratchpad/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, title, archived }),
  }).then(response => {
    return response.json();
  });
};

export const createScratchpad = pageId => {
  return fetch("/Scratchpad", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pageId }),
  }).then(response => {
    return response.json();
  });
};
