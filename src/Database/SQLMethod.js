const db = require('./dbConnect');

const databaseMethods = {
  /**
   *
   * @param {string} sql
   * @param {Array} [param]
   * @returns {Promise<{ok: boolean, result: string | object | Array } | Error>}
   */
  run(sql, param) {
    return new Promise((resolve, reject) => {
      const run = param ? db.run.bind(db, sql, param) : db.run.bind(db, sql);
      run((error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  },
  /**
   *
   * @param {string} sql `string` of SQL SELECT query
   * @param {Array} [param]
   * @returns { Promise<{}>} single first row as per SQL query in `object`
   */
  get(sql, param) {
    return new Promise((resolve, reject) => {
      const get = param ? db.get.bind(db, sql, param) : db.get.bind(db, sql);
      get((error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  },
  /**
   *
   * @param {string} sql `string` of SQL SELECT query
   * @param {Array} [param]
   * @returns {Promise<[{}, {}, ...{}]>} all rows which will match with query in `Array`
   */
  all(sql, param) {
    return new Promise((resolve, reject) => {
      const all = param ? db.all.bind(db, sql, param) : db.all.bind(db, sql);
      all((error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      });
    });
  },
};

module.exports = databaseMethods;
