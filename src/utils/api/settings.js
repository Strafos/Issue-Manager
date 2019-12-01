export const getSettings = () => {
  return fetch("/Settings", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const getJots = () => {
  return fetch("/Jots", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const updateJots = requestObj => {
  return fetch("/Jots", {
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
