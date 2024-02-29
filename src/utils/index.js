const { randomUUID } = require('crypto');
const { existsSync, mkdirSync } = require('fs');
const { tableSchema } = require('../Database/schema');
const [tables] = require('../Database/schema/schemas.json');
const { infoLog } = require('../logger');

const tableList = Object.keys(tables);

const createTables = async (index = 0) => {
  try {
    tableSchema(tableList[index]).then((data) => {
      infoLog(data.message, 'schema-initialization');
      if (data.ok) {
        const i = index + 1;
        if (tableList.length - 1 >= i) {
          createTables(i);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * @param {string} path
 */
const mkDir = async (path) => {
  if (!existsSync(path)) {
    const result = mkdirSync(path, { recursive: true });
    infoLog(result, __filename);
  }
};

const generateIds = async (...rest) =>
  rest.reduce((total, v) => {
    const item = typeof total === 'object' ? total : { [total]: randomUUID() };
    return { ...item, [v]: randomUUID() };
  });

module.exports = { initializeTable: createTables, createDirectory: mkDir, generateIds };
