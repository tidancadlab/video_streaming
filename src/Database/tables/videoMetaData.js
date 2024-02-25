/* eslint-disable camelcase */
const { run, get } = require("../SQLMethod");
/**
 * @param {string} id
 * @param {string}
 * @returns `Object`
 */
const insertVideoMetaData = async (
  id,
  {
    video_id,
    codec_name,
    profile,
    codec_tag_string,
    codec_tag,
    width,
    height,
    level,
    frame_rate,
    time_base,
    duration_ts,
    duration,
    bit_rate,
    nb_frames,
    byte_size,
  },
) => {
  const time_stamp = Date.now();
  try {
    const query = `INSERT INTO videoMetaData (
      id, video_id, codec_name, profile, codec_tag_string, 
      codec_tag, width, height, level, frame_rate, time_base, 
      duration_ts, duration, bit_rate, nb_frames, byte_size, time_stamp
    ) values ( ${video_id}, ${codec_name}, ${profile}, ${codec_tag_string}, ${codec_tag}, 
  ${width}, ${height}, ${level}, ${frame_rate}, ${time_base}, ${duration_ts}, 
  ${duration}, ${bit_rate}, ${nb_frames}, ${byte_size}, ${time_stamp} )`;
    const result = await run(query);
    return {
      message: "meta insert successfully",
      id,
      ok: result.ok,
      result: result.result,
    };
  } catch (error) {
    console.error(error);
    return { message: "something went wrong", ok: false, error };
  }
};
/**
 *
 * @param {string} id the id of video meta data row
 * @returns `string`
 */
const getVideoMetaData = async (id) => {
  try {
    const query = `SELECT * FROM videoMetaData WHERE 'id' '${id}'`;
    const data = await get(query);
    return {
      message: "retrieved meta successfully",
      data: JSON.parse(data),
      ok: true,
    };
  } catch (error) {
    return { message: "something went wrong", ok: false };
  }
};

module.exports = {
  insert: insertVideoMetaData,
  get: getVideoMetaData,
};
