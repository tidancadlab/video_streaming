const { all, run } = require('../SQLMethod');
/**
 *
 * @param {?{ groupBy: string, orderBy: string, limit: number, order : "ASC" | "DESC", offset : number}}
 */
const getVideos = async (search) => {
  const rest = search || {};
  const { groupBy, orderBy, limit, order = 0, offset = 0 } = rest;
  try {
    const query = `SELECT u.full_name, v.id AS video_id, v.path AS video_url, v.time_stamp AS video_created_at, json_extract('[' || GROUP_CONCAT(
    JSON_OBJECT('id', t.id, 'url', t.url, 'size', t.size, 'height', t.height, 'width', t.width, 'created_at', t.time_stamp)
    ) || ']', '$') AS thumbnails FROM user AS u JOIN video AS v ON u.id = v.user_id LEFT JOIN thumbnail AS t ON v.id = t.video_id GROUP BY v.id;`;
    const result = await all(query);
    return {
      video: result.map((v) => ({ ...v, thumbnails: JSON.parse(v.thumbnails) })),
      ok: true,
      total: result.length,
      message: 'retrieve videos successfully',
    };
  } catch (error) {
    console.log(error);
    return { message: 'something went wrong', error, ok: false };
  }
};

/**
 * @param {string} id
 * @param {string} userId
 * @returns `Object` with message and status in `boolean`
 */
const insertVideo = async (id, userId, path, source) => {
  try {
    const query = `INSERT INTO video (id, user_id, path, source, time_stamp) 
    values ('${id}', '${userId}', '${path}', '${source}', '${Date.now()}')`;
    const data = await run(query);
    return { message: 'successfully inserted', ok: true, ...data };
  } catch (error) {
    return { message: 'something went wrong', ok: false, error };
  }
};

module.exports = {
  insert: insertVideo,
  search: getVideos,
};
