export const createReminder = async requestObj => {
  return fetch("/Reminder", {
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