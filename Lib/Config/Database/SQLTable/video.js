const { randomUUID } = require('crypto');
const { all, run } = require('../dbSQL');
/**
 *
 * @param {number} offset it will take from 0
 * @param {number} limit 50 numbers is default
 * @param {string} orderBy time is default
 * @param {boolean} latest true means latest time videos
 * @returns `Object` of video `Array` or error `Object` on error, status and message
 */
exports.getVideos = async (offset = 0, limit = 50, orderBy = 'time', latest = true) => {
  try {
    const query = `SELECT * FROM videos OFFSET ${offset} LIMIT ${limit} ORDER BY ${orderBy} ${latest ? 'ASC' : 'DESC'}`;
    return {
      video: await all(query),
      ok: true,
      message: 'retrieve videos successfully',
    };
  } catch (error) {
    return { message: 'something went wrong', error, ok: false };
  }
};
/**
 * it will insert video link data into videos table
 * @param {string} link video url link that will use to get video file
 * @param {string} location location where video stored in server
 * @param {string} metaId this is the id of video meta data which is stored in videoMetaData table
 * @param {string} watchId this is the id of video watch status like watched time, like, save
 * @param {string} thumbnailId this is id of thumbnail which is stored in thumbnails table
 * @returns `Object` with message and status in `boolean`
 */
exports.insertVideo = async (link, location, metaId, watchId, thumbnailId) => {
  try {
    const query = `INSERT INTO videos (id, link, location, metaId, watchId, thumbnailId time, isReleased, isBlocked) 
    values '${randomUUID()}' '${link}' '${location}' '${metaId}' '${watchId}' '${thumbnailId}' '${Date()}', false, false`;
    const data = await run(query);
    return { message: 'successfully inserted', data, ok: true };
  } catch (error) {
    return { message: 'something went wrong', error, ok: false };
  }
};
