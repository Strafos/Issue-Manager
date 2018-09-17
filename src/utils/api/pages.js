export const getPages = () => {
  return fetch("/Pages", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.json();
  });
};

export const createPage = name => {
  return fetch("/Page", {
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

export const archivePage = (pageId, archived) => {
  return fetch(`/Page/archive/${pageId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ archived }),
  }).then(response => {
    return response.json();
  });
};
