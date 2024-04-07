const { randomUUID } = require('crypto');
const { CODES, CustomError } = require('../../error');
const { checkParameters } = require('../../utils');
const { run } = require('../SQLMethod');
const { infoLog } = require('../../logger');

const modelHls = {
  async hlsInsert(videoId, url) {
    infoLog('Start', 'HLS-Video-Table_Insert');
    checkParameters([['string', 'number'], 'string'], arguments, CODES.HLS_TABLE_PARAMS_ERROR.code);

    try {
      const sql = 'INSERT INTO hls_video (id, video_id, hls_url, time_stamp) values (?, ?, ?, ?)';
      const param = [randomUUID(), videoId, url, Date.now()];

      const result = await run(sql, param);
      infoLog('Done', 'HLS-Video-Table_Insert');
      return result;
    } catch (error) {
      throw new CustomError({ error, code: CODES.HLS_TABLE_ERROR });
    }
  },
};

module.exports = modelHls;
