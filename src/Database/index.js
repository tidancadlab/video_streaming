const { infoLog } = require('../logger');
const { tableSchema } = require('./schema');
const [tables] = require('./schema/schemas.json');

const tableList = Object.keys(tables);

const initializeDatabase = async (index = 0) => {
  try {
    const data = await tableSchema(tableList[index]);
    if (data.ok) {
      const i = index + 1;
      if (tableList.length - 1 >= i) {
        return initializeDatabase(i);
      }
      infoLog('Database setup done', 'database');
      return i;
    }
    return new Error('something went wrong');
  } catch (error) {
    console.log(error);
  }
  return null;
};

module.exports = initializeDatabase;
