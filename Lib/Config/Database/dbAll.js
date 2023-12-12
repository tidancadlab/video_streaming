const db = require('./dbConfig');

const getAll = (sql) => new Promise((resolve, reject) => {
  db.all(sql, (err, result) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(result);
  });
});

const get = async (sql) => {
  try {
    return await getAll(sql);
  } catch (error) {
    return error;
  }
};

module.exports = { getAll: get };
