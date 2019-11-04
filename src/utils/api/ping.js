export const pingServer = () => {
  return fetch("/Ping", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then(response => {
    return response.status === 200;
  });
};
