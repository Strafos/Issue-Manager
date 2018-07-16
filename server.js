const express = require("express");
const bodyParser = require("body-parser");

const db = require("./database");

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

app.post("/sprint", (req, res) => {
  const { name, startDate, endDate } = req.body;
  const query = `INSERT INTO sprints values(null, "${name}", "${startDate}", "${endDate}", "")`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.post("/issue", (req, res) => {
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

app.get("/sprints", (req, res) => {
  const query = `SELECT * FROM sprints`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/sprint/:id", (req, res) => {
  const query = `SELECT * FROM issues where sprint_id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/issue/:id", (req, res) => {
  const query = `SELECT * FROM issues where id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/issue/:id/status", (req, res) => {
  const { status } = req.body;
  const query = `UPDATE issues SET status="${status}" where id=${
    req.params.id
  }`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.put("/issue/:id/blocked", (req, res) => {
  const { blocked } = req.body;
  const query = `UPDATE issues SET blocked="${blocked}" where id=${
    req.params.id
  }`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.put("/issue/:id/time", (req, res) => {
  const { stat, time } = req.body;
  const query = `UPDATE issues SET ${stat}="${time}" where id=${req.params.id}`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.post("/project", (req, res) => {
  const { name } = req.body;
  const query = `INSERT INTO projects values(null, "${name}")`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.get("/projects", (req, res) => {
  const query = `SELECT * FROM projects`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/sprint/:id/notes", (req, res) => {
  const { notes } = req.body;
  const query = `UPDATE sprints SET notes="${notes}" where id=${req.params.id}`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.put("/issue/:id", (req, res) => {
  const {
    name,
    sprintId,
    projectId,
    status,
    timeEstimate,
    timeRemaining,
    timeSpent,
    blocked,
    notes,
    bad
  } = req.body;
  const query =
    `UPDATE issues SET name="${name}", sprint_id=${sprintId}, project_id=${projectId}, ` +
    `status="${status}", time_estimate=${timeEstimate}, time_remaining=${timeRemaining}, ` +
    `time_spent=${timeSpent}, blocked="${blocked}", notes="${notes}", bad=${bad} ` +
    `where id=${req.params.id}`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.delete("/issue/:id", (req, res) => {
  const query = `DELETE FROM issues where id=${req.params.id}`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.get("/recentIssues", (req, res) => {
  const query =
    "SELECT DISTINCT issue_id, name FROM recent_issues ORDER BY id DESC LIMIT 5";
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/recentIssue/:id", (req, res) => {
  const { name } = req.body;
  const query = `INSERT INTO recent_issues VALUES(null, ${
    req.params.id
  }, "${name}")`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
