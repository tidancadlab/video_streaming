const fs = require('fs');
let waitingList = require('./waitingList.json');
const dumpYard = require('./dumpYard.json');

const updateFile = (location, updated) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-path-concat
  fs.writeFile(`${__dirname + location}`, JSON.stringify(updated), 'utf8', (error, data) => {
    if (error) {
      reject(error);
    } else {
      resolve(data);
    }
  });
});

const getWaitingList = async () => waitingList.at(0);

const getLastWaitingNumber = () => (waitingList.length > 0 ? waitingList.at(waitingList.length - 1).id : -1);

const updateWaitingList = async (req) => {
  waitingList.push(req);
  try {
    await updateFile('/waitingList.json', waitingList);
    console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Waiting list updated');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const deleteCompletedItem = async (id) => {
  if (typeof (id) !== 'string' || id === undefined) return false;
  waitingList = waitingList.filter((item) => item.id !== id);
  try {
    await updateFile('/waitingList.json', waitingList);
    console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Waiting list deleted');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const dumpItem = async (item) => {
  dumpYard.push(item);
  try {
    await updateFile('/dumpYard.json', dumpYard);
    console.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> Dumping Successfully Completed');
    return item.id;
  } catch (error) {
    console.error(error);
    return false;
  }
};
module.exports = {
  getWaitingList,
  getLastWaitingNumber,
  updateWaitingList,
  deleteCompletedItem,
  dumpItem,
  waitingListSize: waitingList.length,
};
