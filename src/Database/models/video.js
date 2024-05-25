const { randomUUID } = require('crypto');
const { all, run, get } = require('../SQLMethod');
const { checkParameters } = require('../../utils');
const { CustomError, CODES } = require('../../error');
const { PATH, URL } = require('../../../config');

const modelsVideo = {
  /**
   *
   * @param {Object} search
   * @param {string} [search.groupBy]
   * @param {string} [search.orderBy]
   * @param {string} [search.limit]
   */
  async getVideos(search) {
    const rest = search || {};

    // TODO: Parameters which will use to retrieve data from video table
    const { groupBy, orderBy, limit, order = 0, offset = 0 } = rest;
    try {
      const query = `SELECT vp.title as title,
       u.full_name,
       v.id AS id,
       v.time_stamp AS video_created_at,
       json_extract('[' || GROUP_CONCAT(JSON_OBJECT('id', t.id,
        'url', CONCAT( ? ,t.url),
        'size', t.size,
        'height', t.height,
        'width', t.width,
        'created_at', t.time_stamp)
    ) || ']', '$') AS thumbnails
     FROM user AS u JOIN video AS v ON u.id = v.user_id 
     LEFT JOIN thumbnail AS t ON v.id = t.video_id 
     LEFT JOIN video_profile as vp ON v.id = vp.video_id
     GROUP BY v.id order by video_created_at ;`;
      const params = [`${URL.SERVER_BASE_URL}/${PATH.MEDIA_API_BASE}/`];
      const result = await all(query, params);
      return {
        videos: result.map((v) => ({ ...v, thumbnails: JSON.parse(v.thumbnails) })),
        ok: true,
        total: result.length,
        message: 'retrieve videos successfully',
      };
    } catch (error) {
      console.log(error);
      return { message: 'something went wrong', error, ok: false };
    }
  },

  /**
   * @param {string} id
   * @param {string} userId
   * @param {string} [originalUrl]
   * @param {string} [HLSUrl]
   * @returns `Object` with message and status in `boolean`
   */
  async insertVideo(id, userId, originalUrl) {
    console.log('video insertion start');

    // Checking all params ok or not
    const paramTypes = [['string', 'number'], ['string', 'number'], 'string'];
    checkParameters(paramTypes, arguments, CODES.VIDEO_TABLE_PARAMS_ERROR);

    try {
      const sql = `INSERT INTO video (id, user_id, original_path, time_stamp) values (?, ?, ?, ?)`;
      const SQLparams = [id, userId, originalUrl, Date.now()];
      const data = await run(sql, SQLparams);

      return { message: 'successfully inserted', ok: true, ...data };
    } catch (error) {
      throw new CustomError({
        ...error,
        message: error.message,
        name: 'SQL-VIDEO-TABLE-INSERTING-ERROR',
        code: CODES.VIDEO_TABLE_ERROR.code,
      });
    }
  },

  async getVideoById(id) {
    const sql = 'select v.id as id, CONCAT(?, hls.hls_url) as url from video as v inner join hls_video as hls on v.id = hls.video_id where v.id = ?';
    const data = await get(sql, [`${URL.SERVER_BASE_URL}/${PATH.MEDIA_API_BASE}/`, id]);
    return { ok: true, message: 'retrieved successfully', data };
  },

  async setVideoProfile({ videoId, title, description, category, tags }) {
    if (!videoId) throw Error('videoId not available');

    const id = randomUUID();
    const timeStamp = Date.now();
    const tag = JSON.stringify(tags);

    const sql = `insert into video_profile (id, video_id, title, description, category, tags, time_stamp) values (?, ?, ?, ?, ?, ?, ?)`;
    await run(sql, [id, videoId, title, description, category, tag, timeStamp]);
    return { id, ok: true };
  },

  async updateVideoProfile(props) {
    const timeStamp = Date.now();
    let columns = '';
    const values = [];
    for (const [key, value] of Object.entries(props)) {
      if (value) {
        columns += `${key} = ?,`;
        values.push(Array.isArray(value) ? JSON.stringify(value) : value);
      }
    }

    values.push(timeStamp);
    values.push(props.id);

    const sql = `UPDATE video_profile SET ${columns} time_stamp = ? where id = ?`;
    await run(sql, values);
    return { ok: true };
  },

  async deleteVideoProfile(id) {
    if (!id) throw Error('id should be available for delete Video profile');
    const sql = `DELETE from video_profile where id = ?`;
    await run(sql, [id]);
    return { ok: true };
  },
};

module.exports = modelsVideo;
