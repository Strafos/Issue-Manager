export const getScratchpads = () => {
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