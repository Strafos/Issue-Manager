const express = require("express");
const bodyParser = require("body-parser");

const db = require("./database");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.post("/createSprint", (req, res) => {
  const { name, startDate, endDate } = req.body;
  const query = `INSERT INTO sprints values(null, "${name}", "${startDate}", "${endDate}")`;
  db.insert(query);
  res.send({ dbconn: "Success" });
});

app.post("/getSprints", (req, res) => {
  const query = `SELECT * FROM sprints`;
  const response = db.read(query);
  console.log(response);
  res.send(response);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
