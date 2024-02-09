const db = require('./dbConfig');
/**
 *
 * @param {string} query `string` of SQL query which can for insert, delete, drop, update
 * @returns { Promise<undefined | error>} if execution succeed will return undefined otherwise error `object`
 */
const run = (query) => new Promise((resolve, reject) => {
  db.run(query, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });
});
/**
 *
 * @param {string} query `string` of SQL SELECT query
 * @returns { Promise<{} | error>} single first row as per SQL query in `object`
 */
const get = (query) => new Promise((resolve, reject) => {
  db.get(query, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });
});
/**
 *
 * @param {string} query `string` of SQL SELECT query
 * @returns {Promise<[{}, {}, ...] | error>} all rows which will match with query in `Array`
 */
const all = (query) => new Promise((resolve, reject) => {
  db.all(query, (error, result) => {
    if (error) {
      reject(error);
      return;
    }
    resolve(result);
  });
});

module.exports = {
  run,
  get,
  all,
};
