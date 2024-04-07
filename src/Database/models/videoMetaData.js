/* eslint-disable camelcase */
const { randomUUID } = require('crypto');
const { run, get } = require('../SQLMethod');
const { checkParameters } = require('../../utils');
const { CustomError, CODES } = require('../../error');
const { infoLog } = require('../../logger');

const modelVideoMetaData = {
  /**
   * @param {import('fluent-ffmpeg').FfprobeStream} data
   */
  async insertVideoMetaData(data) {
    infoLog('Metadata insertion start', "insert-video-metadata");

    const {
      videoId,
      codec_name,
      profile,
      codec_tag_string,
      codec_tag,
      width,
      height,
      level,
      frameRate,
      time_base,
      duration_ts,
      duration,
      bit_rate,
      nb_frames,
      byte_size,
    } = data;
    const time_stamp = Date.now();
    const paramType = {
      videoId: ['string', 'number'],
      codec_name: ['string', 'number'],
      profile: ['string', 'number'],
      codec_tag_string: ['string', 'number'],
      width: ['string', 'number'],
      height: ['string', 'number'],
      level: ['string', 'number'],
      frameRate: ['string', 'number'],
      time_base: ['string', 'number'],
      duration_ts: ['string', 'number'],
      duration: ['string', 'number'],
      bit_rate: ['string', 'number'],
      nb_frames: ['string', 'number'],
      byte_size: ['string', 'number'],
    };
    checkParameters(
      paramType,
      {
        videoId,
        codec_name,
        profile,
        codec_tag_string,
        codec_tag,
        width,
        height,
        level,
        frameRate,
        time_base,
        duration_ts,
        duration,
        bit_rate,
        nb_frames,
        byte_size,
      },
      CODES.VIDEO_META_TABLE_PARAMS_ERROR.code,
    );
    try {
      const id = randomUUID();
      const sql = `INSERT INTO video_meta_info (
      id, video_id, codec_name, profile, codec_tag_string, 
      codec_tag, width, height, level, frame_rate, time_base, 
      duration_ts, duration, bit_rate, nb_frames, byte_size, time_stamp
      ) values ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const SQLparams = [
        id,
        videoId,
        codec_name,
        profile,
        codec_tag_string,
        codec_tag,
        width,
        height,
        level,
        frameRate,
        time_base,
        duration_ts,
        duration,
        bit_rate,
        nb_frames,
        byte_size,
        time_stamp,
      ];
      const result = await run(sql, SQLparams);
      infoLog(CODES.VIDEO_META_TABLE_SUCCESS.message, "insert-video-metadata");
      return result;
    } catch (error) {
      throw new CustomError({ ...CODES.VIDEO_META_TABLE_ERROR, ...error, name: 'SQL-VIDEO_METADATA-TABLE-INSERTING' });
    }
  },

  /**
   *
   * @param {string} id the id of video meta data row
   * @returns `string`
   */
  async getVideoMetaData(id) {
    try {
      const query = `SELECT * FROM videoMetaData WHERE 'id' '${id}'`;
      const data = await get(query);
      return {
        message: 'retrieved meta successfully',
        data: JSON.parse(data),
        ok: true,
      };
    } catch (error) {
      return { message: 'something went wrong', ok: false };
    }
  },
};

module.exports = modelVideoMetaData;
