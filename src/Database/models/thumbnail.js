const { randomUUID } = require('crypto');
const { infoLog } = require('../../logger');
const { run } = require('../SQLMethod');

const insertThumbnail = async (videoId, url, size, height, width) => {
  console.log(videoId, url, size, height, width);
  if (!videoId || !url || !size) return new Error('some data not available');
  const timeStamp = Date.now();
  try {
    const sqlQuery = `insert into thumbnail (id, video_id, url, size, height, width, time_stamp) values (?, ?, ?, ?, ?, ?, ?)`;
    const result = await run(sqlQuery, [randomUUID(), videoId, url, size, height || 0, width || 0, timeStamp]);

    infoLog(`${height} Done`, 'Thumbnail-Table-Insert');
    return { ...result, message: 'successfully created' };
  } catch (error) {
    return { ok: false, message: 'successfully created', error };
  }
};

module.exports = {
  insert: insertThumbnail,
};
