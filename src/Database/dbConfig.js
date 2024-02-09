const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const databaseUrl = process.env.DATABASE;
module.exports = new sqlite3.Database(databaseUrl, (err) => {
  if (err) {
    console.error(err);
  }
});
