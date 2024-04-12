const fs = require('fs');
let queueContainer = require('./videoQueueContainer.json');
const { CODES, CustomError } = require('../error');
const { checkParameters } = require('../utils');
const { infoLog, errorLog } = require('../logger');

const codeList = Object.values(CODES).reduce((obj, v) => ({ ...obj, [v.code]: v.message }), {});

/**
 * Writes data to the video queue container file.
 *
 * @param {Object[]} data - The data to be written to the file.
 * @returns {void}
 */
const updateFile = async (data) => {
  try {
    fs.writeFileSync(`${__dirname}/videoQueueContainer.json`, JSON.stringify(data), 'utf-8');
  } catch (error) {
    errorLog(error, 'Error updating file:');
  }
};

const videoQueueItem = {
  /**
   * @param {string | number} id
   */
  async getVideoItem(id) {
    if (!Array.isArray(queueContainer)) return null;
    return queueContainer.find((v) => (id ? v.id === id : !v.hasError));
  },

  /**
   * @param {string | number} id
   * @param {number} code
   * @param {string} errorMessage
   * @param {boolean} hasError
   */

  updateStatusCode(id, code, errorMessage, hasError = false) {
    if (typeof errorMessage === 'boolean') {
      hasError = errorMessage;
    }
    // Check if the provided code is valid
    if (!Object.keys(codeList).includes(code.toString())) {
      throw new Error(`Invalid status code: ${code}. Expected one of ${Object.keys(codeList).join(', ')}.`);
    }

    if (!Array.isArray(queueContainer)) {
      throw new CustomError(
        `Something went wrong: storage is not an Array data type. Please check './src/helper/videoQueue/videoQueueContainer.json'. \r\n ${JSON.stringify(
          queueContainer,
        )}`,
      );
    }

    const item = queueContainer.find((v) => v.id === id);
    if (!item) {
      throw new Error(`Video queue item id: ${id} not found.`);
    }

    item.statusCode = code;
    item.hasError = hasError;
    item.errMessage = errorMessage + codeList[code];

    updateFile(queueContainer);
    infoLog(`Video queue item ${id} status code updated to ${code}: ${codeList[code]}.`);
    return { ok: true };
  },

  /**
   * @param {string} id
   * @param {object} data
   * @param {string} [data.filename]
   * @param {string} [data.videoDirectoryPath]
   * @param {number} [data.aspectRatio]
   * @param {number} [data.duration]
   * @param {number} [data.height]
   */
  async createItem(id, data) {
    infoLog('queue item creation started');
    if (typeof id !== 'string' || typeof data !== 'object') throw new Error('Id and data object required');
    if (queueContainer.findIndex((v) => v.id === id) !== -1) throw new Error('user created already');
    if (!Array.isArray(queueContainer)) queueContainer = [];
    queueContainer.push({
      ...data,
      id,
      statusCode: 100,
      hasError: false,
      timeStamp: Date.now(),
    });
    try {
      await updateFile(queueContainer);
      infoLog(`New video queue item ${id} created`);
      return { ok: true };
    } catch (error) {
      infoLog(error);
    }
    return { ok: false };
  },

  async update(id, rest) {
    checkParameters([['string', 'number'], 'object'], arguments);

    if (!Array.isArray(queueContainer)) {
      throw new CustomError(
        `Something went wrong: storage is not an Array data type. Please check './src/helper/videoQueue/videoQueueContainer.json'. \r\n ${JSON.stringify(
          queueContainer,
        )}`,
      );
    }

    const item = queueContainer.find((v) => v.id === id);
    if (!item) {
      throw new Error(`Video queue item id: ${id} not found.`);
    }

    for (const [key, value] of Object.entries(rest)) {
      item[key] = value;
    }
    updateFile(queueContainer);
    infoLog(`Video queue item ${id} updated.`);
    return { ok: true };
  },
  async deleteItem(id) {
    if (!Array.isArray(queueContainer)) queueContainer = [];
    try {
      queueContainer = queueContainer.filter((v) => v.id !== id);
      await updateFile(queueContainer);
      infoLog(`video queue item ${id} deleted`);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
};

module.exports = videoQueueItem;
