const { run, get } = require('../SQLMethod');
const schemas = require('./schemas.json')[0];

/**
 * @param {string} table name of the table
 * @returns {Promise<string>}
 */
const sqlQuery = async (table, schema = schemas) => {
  const tableSchema = schema[table];
  const tableList = Object.keys(tableSchema);

  if (!tableSchema || typeof tableSchema !== 'object') {
    throw new Error('schema not available');
  }

  let query = `CREATE TABLE IF NOT EXISTS ${table} (\n`;

  for (const [i, columns] of Object.entries(tableList)) {
    const { type, notNull, description, primaryKey = false, defaultItem = false } = tableSchema[columns];
    const comma = parseInt(i, 10) !== tableList.length - 1 ? ',' : '';
    const isForeignKey = columns.toLowerCase() === 'foreignkey';
    if (isForeignKey) {
      const { foreignKey } = tableSchema;
      for (const key of Object.keys(foreignKey)) {
        query += `  FOREIGN KEY (${key}) REFERENCES ${foreignKey[key].table}(${foreignKey[key].column})${comma} --${foreignKey[key].description}\n`;
      }
    } else {
      query += `  ${columns}`;
      if (type || typeof type === 'string') {
        if (type.toLowerCase() === 'string') {
          query += ` VARCHAR(255)`;
        } else if (['datetime', 'bigint'].includes(type.toLowerCase())) {
          query += ` BIGINT`;
        } else {
          query += ` ${type.toUpperCase()}`;
        }
      } else {
        throw new Error('data type required');
      }

      if (primaryKey === true) {
        query += ` PRIMARY KEY`;
      }
      if (defaultItem && notNull === true) {
        query += ` NOT NULL DEFAULT ${defaultItem}${comma} --${description}\n`;
      } else if (defaultItem) {
        query += ` DEFAULT ${defaultItem}${comma} --${description}\n`;
      } else if (notNull === true) {
        query += ` NOT NULL${comma} --${description}\n`;
      } else {
        query += ` ${comma} --${description}\n`;
      }
    }
  }
  return `${query})`;
};

/**
 * @param {string} table
 */
const tableSchema = async (table) => {
  if (!schemas[table]) {
    throw new Error(`Schema not available, 
      please create schema for ${table} table`);
  }
  const isTableExist = await get(`SELECT name FROM sqlite_master WHERE type="table" and name = "${table}"`);
  if (!isTableExist || isTableExist.name !== table) {
    const query = await sqlQuery(table);
    const result = await run(query);
    return { ok: true, ...result, message: `Table ${table} created successful` };
  }
  return { ok: true, message: `Table ${table} already exist in Database` };
};

module.exports = { tableSchema, sqlQuery };
