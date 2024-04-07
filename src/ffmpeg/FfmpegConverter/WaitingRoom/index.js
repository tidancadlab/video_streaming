const fs = require('fs');
let waitingList = require('./waitingList.json');
const { infoLog, errorLog } = require('../../../logger');
/**
 * @param {string} location where the file want to save in system.
 * @param {object} data the updated data in array.
 */
const updateFile = async (location, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(`${`${__dirname}/${location}`}`, JSON.stringify(data), 'utf8', (error) => {
      if (error) {
        console.error(error);
        reject(new Error('something went wrong.'));
        return null;
      }
      console.log('item updated in waiting list');
      console.log(waitingList);
      return resolve({ ok: true, message: 'this file has been saved successfully.' });
    });
  });

/**
 * @returns {Promise<{
 *   id: string,
 *   hasError: boolean,
 *   message: string,
 *   isDone: boolean,
 *   statusCode: number,
 *   tables: {
 *     videosId: string,
 *     metaId: string,
 *     thumbnailId: string,
 *     watchId: string
 *   },
 *   source: string,
 *   path: string,
 *   duration: number
 * } | undefined >} data
 */

const getWaitingItem = async () => {
  const data = waitingList.find(({ hasError, isDone }) => !hasError && !isDone);
  console.log(data);
  return data;
};

/**
 * Updates the waiting list item with the specified ID.
 * @param {string} itemId - The ID of the waiting list item to update.
 * @param {Object} data - The data to update the waiting list item with.
 * @param {boolean} [data.hasError] - Whether the waiting list item has an error.
 * @param {string} [data.message] - The message associated with the waiting list item.
 * @param {boolean} [data.isDone] - Whether the waiting list item is done.
 * @param {100 | 200 | 300 | 400} [data.statusCode] - The status code of the waiting list item.
 * @param {Object} [data.tables] - The tables associated with the waiting list item.
 * @param {string} [data.tables.videosId] - The videosId table associated with the waiting list item.
 * @param {string} [data.tables.metaId] - The metaId table associated with the waiting list item.
 * @param {string} [data.tables.thumbnailId] - The thumbnailId table associated with the waiting list item.
 * @param {string} [data.tables.watchId] - The watchId table associated with the waiting list item.
 * @param {string} [data.source] - The source of the waiting list item.
 * @param {string} [data.path] - The path of the waiting list item.
 * @param {number} [data.duration] - The duration of the waiting list item.
 */
const updateWaitingList = async (itemId, data) => {
  if (!itemId) return new Error('itemId required');
  const findItem = waitingList.find(({ id }) => id === itemId) || {};
  const { tables, path, duration, source } = { ...findItem, ...data };
  if (!tables || !tables.metaId || !tables.thumbnailId || !tables.videosId || !tables.watchId || !path || !duration || !source) {
    return new Error('data Required');
  }
  const item = { id: itemId, hasError: false, message: null, isDone: false, statusCode: 100, ...findItem, ...data };
  try {
    const newItem = waitingList.filter((v) => v.id !== itemId);
    newItem.push(item);
    const result = await updateFile('waitingList.json', newItem);
    infoLog(result.message, 'waiting room');
    return item;
  } catch (error) {
    return error;
  }
};

/**
 * @param {string} id
 */

const deleteItem = async (id) => {
  if (typeof id !== 'string' || !id) return new Error('Id Require');
  waitingList = waitingList.filter((item) => item.id !== id);
  try {
    await updateFile('waitingList.json', waitingList);
    infoLog('Waiting list deleted', 'waiting room');
    return true;
  } catch (error) {
    errorLog(error);
    return false;
  }
};
module.exports = {
  getWaitingItem,
  updateWaitingList,
  deleteItem,
};
