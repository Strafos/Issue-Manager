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

const getSprints = () => {
  return fetch("/getSprints", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(response => {
    return response.json();
  });
  // const body = await response.json();
  // console.log( //   body.body
  //     .getReader()
  //     .read()
  //     .then(bar => console.log(bar))
  // );

  // if (response.status !== 200) throw Error(body.message);

  // return body;
};

// export default { createSprint, getSprints };
// export default createSprint;
export default getSprints;
