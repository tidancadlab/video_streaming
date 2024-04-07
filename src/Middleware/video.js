const { ffprobe } = require('fluent-ffmpeg');

/**
 *
 * @param {string} source
 * @returns {Promise<import('fluent-ffmpeg').FfprobeData >}
 */
exports.getMeteData = async (source) =>
  new Promise((resolve, reject) => {
    ffprobe(source, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      resolve(data);
    });
  });
