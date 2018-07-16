const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbFile = path.normalize(path.join(__dirname, "/db/", "zim.db"));

const insert = query => {
  let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, err => {
    if (err) {
      console.log("a");
      return console.log(err.message);
    }
  });

  // db.serialize(() => {
  //   db.each(`${query}`, (err, row) => {
  //     if (err) {
  //       console.log("b");
  //       console.error(err.message);
  //       return err.message;
  //     }
  //   });
  // });

  const prom = new Promise((resolve, reject) => {
    db.all(query, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(res);
    });
  });

  db.close(err => {
    if (err) {
      console.error(err.message);
    }
  });

  return prom;
};

const read = async query => {
  let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY, err => {
    if (err) {
      return console.log(err.message);
    }
    // console.log("Connected to sim.db");
  });

  const prom = new Promise((resolve, reject) => {
    db.all(query, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(res);
    });
  });

  db.close(err => {
    if (err) {
      console.error(err.message);
    }
    // console.log("Close the database connection.");
  });

  return prom;
};

module.exports = {
  insert: insert,
  read: read
};
