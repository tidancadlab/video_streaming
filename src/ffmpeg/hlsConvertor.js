const { exec } = require('child_process');
const { ffmpegVideoHlsScript } = require('../Script/ScriptGenerator');
const { infoLog } = require('../logger');
const { checkParameters } = require('../utils');
const { CustomError, CODES } = require('../error');

const videoConversionProgress = (data, duration) => {
  const output = data.toString('utf8');
  const progressMatch = output.match(/time=(\d+:\d+:\d+\.\d+)/);
  if (progressMatch) {
    const currentTime = progressMatch[1];
    const timeArray = currentTime.split(':');
    const [seconds, ms] = timeArray[2].split('.');
    const inSecond = Number(seconds) + Number(timeArray[1] * 60) + Number(timeArray[0] * 60 * 60);
    const percent = parseFloat(`${inSecond}.${ms}`) / duration;
    process.stdout.write(`\r[${'#'.repeat((100 * percent).toFixed(0))}${' '.repeat((100 - 100 * percent).toFixed(0))}] ${(percent * 100).toFixed(2)}% `);
  }
};

const hls = {
  /**
   *
   * @param {string} videoSourcePath
   * @param {number} videoDuration
   * @param {import('fluent-ffmpeg').FfprobeStream} [metadata]
   * @param {string} [destinationPath]
   * @returns {Promise<{hlsUrl: string, message: string}>}
   */
  async convertor(videoSourcePath, videoDuration, metadata, destinationPath) {
    const videoMeta = metadata || {};
    infoLog('Start', 'HLS-Video-Converter');
    const paramTypes = {
      videoSourcePath: 'string',
      videoDuration: 'number',
      destinationPath: ['string', 'undefined'],
    };
    checkParameters(paramTypes, { videoSourcePath, videoDuration, destinationPath }, CODES.HLS_INIT.code);

    const command = ffmpegVideoHlsScript(videoSourcePath, destinationPath, {
      ...videoMeta,
    });
    return new Promise((resolve, reject) => {
      const exc = exec(command.script, (err) => {
        if (err) {
          console.error(err);
          reject(new CustomError({ message: err.message, name: err.name, ...err, code: CODES.HLS_ERROR.code }));
        }
      });

      exc.stderr.on('data', async (data) => {
        videoConversionProgress(data, videoDuration);
      });

      exc.on('close', async (code) => {
        infoLog(`close code ${code}`, 'HLS-Video-Converter-on-close');
        if (code !== 0) {
          reject(new CustomError(`Something went wrong in Video Conversion : closed with code - ${code}`, 'hls-close', CODES.HLS_ERROR.code));
        } else {
          infoLog();
          resolve({ hlsUrl: command.destination, message: CODES.HLS_SUCCESS.message });
        }
      });
    });
  },
};

module.exports = hls;
