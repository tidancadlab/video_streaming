const { all, run, get } = require('../SQLMethod');
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
    ) || ']', '$') AS thumbnails FROM user AS u JOIN video AS v ON u.id = v.user_id LEFT JOIN thumbnail AS t ON v.id = t.video_id WHERE t.url is not null and v.is_relesed = '1' GROUP BY v.id;`;
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
 * @param {string} [originalUrl]
 * @param {string} [HLSUrl]
 * @returns `Object` with message and status in `boolean`
 */
const insertVideo = async (id, userId, originalUrl, HLSUrl) => {
  try {
    const query = `INSERT INTO video (id, user_id, path, source, time_stamp) 
    values ('${id}', '${userId}', '${HLSUrl}', '${originalUrl}', '${Date.now()}')`;
    const data = await run(query);
    return { message: 'successfully inserted', ok: true, ...data };
  } catch (error) {
    return { message: 'something went wrong', ok: false, error };
  }
};

const getVideoById = async (id) => {
  try {
    const data = await get(
      `select v.id, json_object(cast(t.height as text), json_object('id', t.id, 'url', t.url)) as thumbnail from video as v inner join thumbnail as t on v.id = t.video_id where v.id = '${id}' group by v.id`
    );
    // data = { ...data, url: data.url.replace(/\\/g, '/') };
    return { ok: true, message: 'retrieved successfully', data };
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  insert: insertVideo,
  search: getVideos,
  getVideoById,
};
