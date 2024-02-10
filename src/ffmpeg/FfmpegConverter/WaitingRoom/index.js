const fs = require('fs');
let waitingList = require('./waitingList.json');
const dumpYard = require('./dumpYard.json');
const { infoLog, errorLog } = require('../../../logger');
/**
 * @param {string} location where the file want to save in system.
 * @param {object} data the updated data in array.
 * @returns {Promise<string | error>}
 */
const updateFile = (location, data) => new Promise((resolve, reject) => {
  fs.writeFile(`${`${__dirname}/${location}`}`, JSON.stringify(data), 'utf8', (error) => {
    if (error) {
      console.error(error);
      reject(new Error('something went wrong.'));
    } else {
      resolve('this file has been saved successfully.');
    }
  });
});

/**
 * @returns first item from array list otherwise null on empty list.
 */

const getWaitingItem = async () => waitingList.at(0);

const getLastWaitingNumber = () => (waitingList.length > 0 ? waitingList.at(waitingList.length - 1).id : null);
/**
 * @param {object} data
 * @returns `boolean`
 * @description this will add video items in waiting list and return `true` on successful execution otherwise it will be `false`.
 */
const updateWaitingList = async (data) => {
  waitingList.push(data);
  try {
    const status = await updateFile('waitingList.json', waitingList);
    infoLog(`Waiting list updated \n ${status}`, 'waiting room');
    return true;
  } catch (error) {
    errorLog(error);
    return false;
  }
};

/**
 * @param {string} id
 * @returns `boolean`
 * @description when success then it will return true otherwise false.
 */

const deleteItem = async (id) => {
  if (typeof (id) !== 'string' || id === undefined) return false;
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
/**
 * @param {object} item
 * @returns if successfully excited then it will return id of item otherwise false will be returned.
 */
const dumpItem = async (item) => {
  dumpYard.push(item);
  try {
    await updateFile('dumpYard.json', dumpYard);
    infoLog('Dumping Successfully Completed', 'waiting room');
    return true;
  } catch (error) {
    errorLog(error);
    return false;
  }
};
module.exports = {
  getWaitingItem,
  getLastWaitingNumber,
  updateWaitingList,
  deleteItem,
  dumpItem,
  waitingListSize: waitingList.length,
};
