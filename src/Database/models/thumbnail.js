const { infoLog } = require('../../logger');
const { run } = require('../SQLMethod');

const insertThumbnail = async (id, videoId, url, size, height, width) => {
  if (!id || !videoId || !url || !size || !height || !width) return new Error('some data not available');
  const timeStamp = Date.now();
  try {
    const sqlQuery = `insert into thumbnail (id, video_id, url, size, height, width, time_stamp) values ("${id}", "${videoId}", "${url}", ${size}, ${height}, ${width}, "${timeStamp}" )`;
    const result = await run(sqlQuery);

    infoLog(`${height} Done`, 'Thumbnail-Table-Insert');
    return { ...result, message: 'successfully created' };
  } catch (error) {
    return { ok: false, message: 'successfully created', error };
  }
};

module.exports = {
  insert: insertThumbnail,
};
