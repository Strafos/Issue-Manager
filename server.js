const express = require("express");
const bodyParser = require("body-parser");

const db = require("./database");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.post("/createSprint", (req, res) => {
  const { name, startDate, endDate } = req.body;
  const query = `INSERT INTO sprints values(null, "${name}", "${startDate}", "${endDate}", "")`;
  db.insert(query);
  res.send({ dbconn: "Success" });
});

app.post("/createIssue", (req, res) => {
  const {
    sprintId,
    name,
    timeSpent,
    timeEstimate,
    timeRemaining,
    status,
    blocked,
    projectId,
    notes
  } = req.body;
  const query =
    `INSERT INTO issues values(null, ` +
    `${sprintId}, "${name}", "${status}", ` +
    `${timeEstimate}, ${timeRemaining}, ` +
    `${projectId}, "${blocked}", ${timeSpent}, "${notes}")`;
  db.insert(query);
  res.send({ dbconn: "Success" });
});

app.get("/getSprints", (req, res) => {
  const query = `SELECT * FROM sprints`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/getSprint/:id", (req, res) => {
  const query = `SELECT * FROM issues where sprint_id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/getIssue/:id", (req, res) => {
  const query = `SELECT * FROM issues where id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/setStatus/:id", (req, res) => {
  const { status } = req.body;
  const query = `UPDATE issues SET status="${status}" where id=${
    req.params.id
  }`;
  db.insert(query);
});

app.put("/setBlocked/:id", (req, res) => {
  const { blocked } = req.body;
  const query = `UPDATE issues SET blocked="${blocked}" where id=${
    req.params.id
  }`;
  db.insert(query);
  res.send({ dbconn: "Success" });
});

app.put("/setTime/:id", (req, res) => {
  const { stat, time } = req.body;
  const query = `UPDATE issues SET ${stat}="${time}" where id=${req.params.id}`;
  db.insert(query);
  res.send({ dbconn: "Success" });
});

app.post("/createProject", (req, res) => {
  const { name } = req.body;
  const query = `INSERT INTO projects values(null, "${name}")`;
  db.insert(query);
  res.send({ dbconn: "Success" });
});

app.post("/getProjects", (req, res) => {
  const query = `SELECT * FROM projects`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/updateNotes/:id", (req, res) => {
  const { notes } = req.body;
  const query = `UPDATE sprints SET notes="${notes}" where id=${req.params.id}`;
  db.insert(query);
});

app.put("/updateIssue/:id", (req, res) => {
  const {
    name,
    sprintId,
    projectId,
    status,
    timeEstimate,
    timeRemaining,
    timeSpent,
    blocked,
    notes
  } = req.body;
  const query =
    `UPDATE issues SET name="${name}", sprint_id=${sprintId}, project_id=${projectId}, ` +
    `status="${status}", time_estimate=${timeEstimate}, time_remaining=${timeRemaining}, ` +
    `time_spent=${timeSpent}, blocked="${blocked}", notes="${notes} "` +
    `where id=${req.params.id}`;
  db.insert(query);
});

app.delete("/issue/:id", (req, res) => {
  const query = `DELETE FROM issues where id=${req.params.id}`;
  db.insert(query);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
