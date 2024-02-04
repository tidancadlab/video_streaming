const { run, get } = require('../dbSQL');
/**
 *
 * @param {string} id
 * @param {string} meta meta data of video
 * @returns `Object`
 */
exports.insertVideoMetaData = async (id, meta) => {
  try {
    const query = `INSERT INTO videoMetaData (id, meta) values '${id}' '${meta}'`;
    await run(query);
    return { message: 'meta insert successfully', id, ok: true };
  } catch (error) {
    return { message: 'something went wrong', ok: false };
  }
};
/**
 *
 * @param {string} id the id of video meta data row
 * @returns `string`
 */
exports.getVideoMetaData = async (id) => {
  try {
    const query = `SELECT * FROM videoMetaData WHERE 'id' '${id}'`;
    const data = await get(query);
    return { message: 'retrieved meta successfully', data: JSON.parse(data), ok: true };
  } catch (error) {
    return { message: 'something went wrong', ok: false };
  }
};
