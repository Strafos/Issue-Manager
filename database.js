const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// const dbFile = path.normalize(path.join(__dirname, "/db/", "zim.db"));
const dbFile = path.normalize(path.join(__dirname, "/db/", "dev.db"));

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, err => {
  if (err) {
    return console.log(err.message);
  }
});

/**
 * insert() handles all the non-select database queries
 * returns Promise with the query
 * Most frontend API calls don't care what is returned,
 * but some check that the API was successful
 */
const insert = (query, params) => {
  // let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, err => {
  //   if (err) {
  //     return console.log(err.message);
  //   }
  // });

  const prom = new Promise((resolve, reject) => {
    db.all(query, params, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(res);
    });
  });

  // db.close(err => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  // });

  return prom;
};

/**
 * Handle any SELECT queries on database
 * returns a Promise obj with data
 */
const read = async query => {
  // let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READONLY, err => {
  //   if (err) {
  //     return console.log(err.message);
  //   }
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

  // db.close(err => {
  //   if (err) {
  //     console.error(err.message);
  //   }
  // });

  return prom;
};

module.exports = {
  insert: insert,
  read: read,
};
