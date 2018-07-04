const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbFile = path.normalize(path.join(__dirname, "/db/", "sim.db"));
let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, err => {
  if (err) {
    return console.log(err.message);
  }
  console.log("Connected to sim.db");
});

db.serialize(() => {
  db.each(`SELECT * FROM sprints`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    // console.log(row.id + "\t" + row.name);
    console.log(row);
  });
});

db.close(err => {
  if (err) {
    console.error(err.message);
  }
  console.log("Close the database connection.");
});

// const app = express();
// app.use(bodyParser.json());
// const port = process.env.PORT || 5000;

// app.post("/createSprint", (req, res) => {
//   console.log(req.body);
//   res.send({ express: "Hello From Express" });
// });

// app.listen(port, () => console.log(`Listening on port ${port}`));
