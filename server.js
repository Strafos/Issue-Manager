// Express server hosting API endpoints

const express = require("express");
const bodyParser = require("body-parser");

const db = require("./database");
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

// Create new sprint
// search: createsprint
app.post("/sprint", (req, res) => {
  const { name, startDate, endDate } = req.body;
  const query = `INSERT INTO sprints values(null, (?), (?), (?), '', '')`;
  db.insert(query, [name, startDate, endDate])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Create new issue
// search: createissue
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
    notes,
  } = req.body;
  // const query = `INSERT INTO sprints values(null, (?), (?), (?), '')`;
  // db.insert(query, [name, startDate, endDate])
  const query =
    `INSERT INTO issues values(null, ` +
    `${sprintId}, (?), '${status}', ` +
    `${timeEstimate}, ${timeRemaining}, ` +
    `${projectId}, '${blocked}', ${timeSpent}, (?), 0, 0)`;
  db.insert(query, [name, notes]);
  res.send({ dbconn: "Success" });
});

// Get all sprints
// search: getsprints
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

// Get issues of particular sprint
// search: getSprintIssues
app.get("/sprint/:id/issues", (req, res) => {
  const query = `SELECT * FROM issues where sprint_id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get single sprint by ID
// search: getSprint
app.get("/sprint/:id", (req, res) => {
  const query = `SELECT * FROM sprints where id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get specific issue
// search: getissue
app.get("/Issue/:id", (req, res) => {
  const query = `SELECT * FROM issues where id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Update issue status
// search: updatestatus
app.put("/issue/:id/status", (req, res) => {
  const { status } = req.body;
  const query = `UPDATE issues SET status='${status}' where id=${
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

// Update blocked
// search: updateblocked
app.put("/issue/:id/blocked", (req, res) => {
  const { blocked } = req.body;
  const query = `UPDATE issues SET blocked='${blocked}' where id=${
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

// Update shownotes
// search: updateshownotes
app.put("/issue/:id/showNotes", (req, res) => {
  const { bool } = req.body;
  const query = `UPDATE issues SET show_notes=${bool} where id=${
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

// Update issueTime
// search: updateIssueTime
// search: setTime
app.put("/issue/:id/time", (req, res) => {
  const { stat, time } = req.body;
  const insert = `UPDATE issues SET ${stat}=(?) where id=(?)`;
  const select = `SELECT * from issues where id=${req.params.id}`;
  db.insertReturning(insert, select, [time, req.params.id])
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Create project
// search: createProject
app.post("/project", (req, res) => {
  const { name } = req.body;
  const query = `INSERT INTO projects values(null, (?))`;
  db.insert(query, [name])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Create timelog
// search: createTimelog
app.post("/log", (req, res) => {
  const { issueId, delta, stat, createdAt, total } = req.body;
  const query =
    `INSERT INTO timelog (issue_id, sprint_id, time_delta, time_stat, created_at, total) ` +
    `SELECT ${issueId}, i.sprint_id, ${delta}, '${stat}', '${createdAt}', ${total} ` +
    `FROM issues i ` +
    `WHERE i.id=${issueId}`;
  db.insert(query)
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Get all timelogs for a sprint
// search: getTimelogs
app.get("/log/:id", (req, res) => {
  let query;
  if (req.query.type) {
    query =
      `SELECT timelog.id, timelog.issue_id, timelog.sprint_id, ` +
      `timelog.time_delta, timelog.time_stat, timelog.created_at, issues.name, timelog.total ` +
      `FROM timelog INNER JOIN issues ON timelog.issue_id = issues.id ` +
      `WHERE timelog.sprint_id=${req.params.id} AND timelog.time_stat='${
        req.query.type
      }';`;
  } else {
    query =
      `SELECT timelog.id, timelog.issue_id, timelog.sprint_id, ` +
      `timelog.time_delta, timelog.time_stat, timelog.created_at, issues.name, timelog.total ` +
      `FROM timelog INNER JOIN issues ON timelog.issue_id = issues.id ` +
      `WHERE timelog.sprint_id=${req.params.id};`;
  }
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get projects
// search: getprojects
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

// updateNotes
app.put("/sprint/:id/notes", (req, res) => {
  const { notes } = req.body;
  const query = "UPDATE sprints SET notes=(?) where id=(?)";
  // const query = `UPDATE sprints SET notes='${notes}' where id=${req.params.id}`;
  console.log(query);
  db.insert(query, [notes, req.params.id])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// updateNotes
app.put("/sprint/:id/quote", (req, res) => {
  const { quote } = req.body;
  const query = "UPDATE sprints SET quote=(?) where id=(?)";
  db.insert(query, [quote, req.params.id])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// updateIssueNotes
app.put("/issue/:id/notes", (req, res) => {
  const { notes } = req.body;
  const query = "UPDATE issues SET notes=(?) where id=(?)";
  db.insert(query, [notes, req.params.id])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// updateIssue
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
    bad,
  } = req.body;
  // const query =
  //   `UPDATE issues SET name='${name}', sprint_id=${sprintId}, project_id=${projectId}, ` +
  //   `status='${status}', time_estimate=${timeEstimate}, time_remaining=${timeRemaining}, ` +
  //   `time_spent=${timeSpent}, blocked='${blocked}', notes='${notes}', bad=${bad} ` +
  //   `where id=${req.params.id}`;
  const query =
    `UPDATE issues SET name=(?), sprint_id=(?), project_id=(?), ` +
    `status=(?), time_estimate=(?), time_remaining=(?), ` +
    `time_spent=(?), blocked=(?), notes=(?), bad=(?) ` +
    `where id=(?)`;
  console.log(query);
  db.insert(query, [
    name,
    sprintId,
    projectId,
    status,
    timeEstimate,
    timeRemaining,
    timeSpent,
    blocked,
    notes,
    bad,
    req.params.id,
  ])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// deleteissue
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

// deleteTimeLog
app.delete("/timelog/:id", (req, res) => {
  const query = `DELETE FROM timelog where id=${req.params.id}`;
  db.insert(query)
    .then(() => {
      res.send(req.params.id);
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
  const query = `INSERT INTO recent_issues VALUES(null, ${req.params.id}, (?))`;
  db.insert(query, [name])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Get all todos that aren't done
// search: getTodos
app.get("/todos", (req, res) => {
  const query = `SELECT * FROM todos where done = 0`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get all todos that aren't done
// search: addTodo
app.put("/todos", (req, res) => {
  const query = `INSERT INTO todos values(null, '${req.body.todoName}', 0)`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Set todo done to true (1)
// search: finishTodo
app.post("/todos/:id", (req, res) => {
  const query = `UPDATE todos SET done=1 where id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
