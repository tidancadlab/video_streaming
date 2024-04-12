require("dotenv").config();
const sqlite3 = require("sqlite3").verbose();
const { errorLog, infoLog } = require("../logger");

const db = new sqlite3.Database(process.env.DATABASE, (err) => {
  if (err) {
    errorLog(err, "DB Connection");
    return;
  }
  infoLog("Database connected...", 'database');
});

// db.on("error", (error) => {
//   infoLog(error, 'db-error');
// });

// db.on("open", () => {
//   infoLog("database open", 'db-on-open');
// });

// db.on("close", () => {
//   infoLog("database closed", 'db-on-close');
// });

// db.on("change", (type, database, table, rowId) => {
//   infoLog(type, 'db-on-change-type');
//   infoLog(database, 'db-on-change-database');
//   infoLog(table, 'db-on-change-table');
//   infoLog(rowId, 'db-on-change-rowId');
// });

// db.on("profile", (sql, time) => {
//   infoLog(sql, 'db-on-profile-sql');
//   // infoLog(time, 'db-on-profile-time');
// });

module.exports = db;
