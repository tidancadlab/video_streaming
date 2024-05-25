const { infoLog } = require('../logger');
const { tableSchema } = require('./schema');
const [tables] = require('./schema/schemas.json');

const tableList = Object.keys(tables);

const initializeDatabase = async (index = 0) => {
  try {
    const data = await tableSchema(tableList[index]);
    if (data.ok) {
      if (tableList.length - 1 >= index + 1) {
        return initializeDatabase(index + 1);
      }
      infoLog('Database setup done', 'database');
      return index;
    }
    return new Error('something went wrong');
  } catch (error) {
    console.log(error);
  }
  return null;
};

module.exports = initializeDatabase;
