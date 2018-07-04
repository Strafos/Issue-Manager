// const createSprint = async requestObj => {
//   const response = await fetch("/createSprint", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify(requestObj)
//   });
//   const body = await response.json();

//   if (response.status !== 200) throw Error(body.message);

//   return body;
// };

const getSprints = async () => {
  const response = await fetch("/getSprints", {
    method: "POST"
  });
  const body = await response;

  if (response.status !== 200) throw Error(body.message);

  return body;
};

// export default { createSprint, getSprints };
// export default createSprint;
export default getSprints;
