// Express server hosting API endpoints
const express = require("express");
const bodyParser = require("body-parser");
const editJsonFile = require("edit-json-file");

const db = require("./database");
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

// Create new sprint
// search: createSprint
app.post("/Sprint", (req, res) => {
  const { name, startDate, endDate } = req.body;
  const query = `INSERT INTO sprints values(null, (?), (?), (?), '', '')`;
  const select = `SELECT * FROM sprints WHERE id in (SELECT last_insert_rowid());`;
  db.insertReturning(query, select, [name, startDate, endDate])
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Create new issue
// search: createIssue
app.post("/Issue", (req, res) => {
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
  const query =
    `INSERT INTO issues values(null, ` +
    `${sprintId}, (?), '${status}', ` +
    `${timeEstimate}, ${timeRemaining}, ` +
    `${projectId}, '${blocked}', ${timeSpent}, (?), 0, 0)`;
  const select = `SELECT * FROM issues WHERE id in (SELECT last_insert_rowid());`;
  db.insertReturning(query, select, [name, notes])
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Get all sprints
// search: getSprints
app.get("/Sprints", (req, res) => {
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
app.get("/Sprint/:id/issues", (req, res) => {
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
app.get("/Sprint/:id", (req, res) => {
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
app.put("/Issue/:id/status", (req, res) => {
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
app.put("/Issue/:id/blocked", (req, res) => {
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
app.put("/Issue/:id/showNotes", (req, res) => {
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
app.put("/Issue/:id/time", (req, res) => {
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
app.post("/Project", (req, res) => {
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
app.post("/Log", (req, res) => {
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
app.get("/Log/:id", (req, res) => {
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
app.get("/Projects", (req, res) => {
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
app.put("/Sprint/:id/notes", (req, res) => {
  const { notes } = req.body;
  const query = "UPDATE sprints SET notes=(?) where id=(?)";
  db.insert(query, [notes, req.params.id])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// updateNotes
app.put("/Sprint/:id/quote", (req, res) => {
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
app.put("/Issue/:id/notes", (req, res) => {
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
app.put("/Issue/:id", (req, res) => {
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
  const query =
    `UPDATE issues SET name=(?), sprint_id=(?), project_id=(?), ` +
    `status=(?), time_estimate=(?), time_remaining=(?), ` +
    `time_spent=(?), blocked=(?), notes=(?), bad=(?) ` +
    `where id=(?)`;
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
app.delete("/Issue/:id", (req, res) => {
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
app.delete("/Log/:id", (req, res) => {
  const query = `DELETE FROM timelog where id=${req.params.id}`;
  db.insert(query)
    .then(() => {
      res.send(req.params.id);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Get all todos that aren't done
// search: getTodos
app.get("/Todos", (req, res) => {
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
app.put("/Todos", (req, res) => {
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
app.post("/Todos/:id", (req, res) => {
  const query = `UPDATE todos SET done=1 where id=${req.params.id}`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Settings
// search: settings
app.get("/Settings", (req, res) => {
  const file = editJsonFile(`${__dirname}/config.json`);
  res.send(file.get());
});

// search: getAllScratchpads
app.get("/Scratchpads", (req, res) => {
  const query = "SELECT * FROM scratchpads WHERE archived=0 ORDER BY id DESC";
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// search: getArchivedScratchpads
app.get("/Scratchpads/archived", (req, res) => {
  const query = "SELECT * FROM scratchpads where archived=1 ORDER BY id DESC";
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// search: getScratchpads
app.get("/Scratchpads/:page", (req, res) => {
  const query = `SELECT * FROM scratchpads where archived=0 AND page=${
    req.params.page
    } ORDER BY id DESC`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

// Get all todos that aren't done
// search: setScratchpad
app.put("/Scratchpad/:id", (req, res) => {
  const { content, title, archived } = req.body;
  let query;
  let params;
  if (typeof archived === "undefined") {
    query = `UPDATE scratchpads SET content=(?), title=(?) where id=(?)`;
    params = [content, title || "", req.params.id];
  } else {
    query = `UPDATE scratchpads SET content=(?), title=(?), archived=(?) WHERE id=(?)`;
    params = [content, title || "", archived, req.params.id];
  }
  const select = `SELECT * FROM scratchpads where id=${req.params.id}`;
  db.insertReturning(query, select, params)
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Get all todos that aren't done
// search: createScratchpad
app.post("/Scratchpad", (req, res) => {
  const { pageId } = req.body;
  const query = `INSERT INTO scratchpads values(null, "", "", 0, (?))`;
  const select = `SELECT * FROM scratchpads WHERE id in (SELECT last_insert_rowid());`;
  db.insertReturning(query, select, [pageId])
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Events
// search: getEvents
app.get("/Events", (req, res) => {
  const query = `SELECT * FROM events`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/Event", (req, res) => {
  const { id, title, start, allDay } = req.body;
  const query = `INSERT INTO events values((?), (?), (?), (?), NULL)`;
  db.insert(query, [id, title, start, allDay])
    .then(() => {
      res.send({ status: "Success" });
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.get("/Pages", (req, res) => {
  const query = `SELECT * FROM scratchpad_pages where archived=0`;
  db.read(query)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      console.log(err);
    });
});

app.post("/Page", (req, res) => {
  const { name } = req.body;
  const query = `INSERT INTO scratchpad_pages values(NULL, (?), 0)`;
  const select = `SELECT * FROM scratchpad_pages WHERE id in (SELECT last_insert_rowid());`;
  db.insertReturning(query, select, [name])
    .then(response => {
      res.send(response[0]);
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

app.put("/Page/archive/:id", (req, res) => {
  const { archived } = req.body;
  const query = `UPDATE scratchpad_pages SET archived=(?) WHERE id=(?)`;
  const query2 = `UPDATE scratchpads SET archived=(?) WHERE page=(?)`;
  db.insert(query, [archived, req.params.id])
    .then(() => {
      if (archived === 1) {
        db.insert(query2, [archived, req.params.id])
          .then(() => {
            res.send(req.params.id);
          })
          .catch(err => {
            res.send({ status: "Failure" });
          });
      } else {
        res.send(req.params.id);
      }
    })
    .catch(err => {
      res.send({ status: "Failure" });
    });
});

// Ping backend server
app.get("/Ping", (_, res) => {
  res.send();
});


app.listen(port, () => console.log(`Listening on port ${port}`));
