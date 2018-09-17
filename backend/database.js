const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbFile = path.normalize(path.join(__dirname, "../db/", "zim.db"));

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
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(res);
    });
  });
};

/**
 * Handle any SELECT queries on database
 * returns a Promise obj with data
 */
const read = async query => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      resolve(res);
    });
  });
};

/**
 * insert() handles all the non-select database queries
 * returns Promise with the query
 * Most frontend API calls don't care what is returned,
 * but some check that the API was successful
 */
const insertReturning = (insert, select, params) => {
  return new Promise((resolve, reject) => {
    db.all(insert, params, (err, res) => {
      if (err) {
        console.error(err.message);
        reject(err);
      }
      db.all(select, (err, res) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        resolve(res);
      });
    });
  });
};

module.exports = {
  insert: insert,
  read: read,
  insertReturning: insertReturning,
};
