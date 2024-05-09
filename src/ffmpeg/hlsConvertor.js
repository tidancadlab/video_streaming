const { exec } = require('child_process');
const { infoLog } = require('../logger');
const { checkParameters } = require('../utils');
const { CustomError, CODES } = require('../error');
const ffmpegScript = require('../Script/ScriptGenerator');

const videoConversionProgress = (data, duration) => {
  const output = data.toString('utf8');
  const progressMatch = output.match(/time=(\d+:\d+:\d+\.\d+)/);
  if (progressMatch) {
    const currentTime = progressMatch[1];
    const timeArray = currentTime.split(':');
    const [seconds, ms] = timeArray[2].split('.');
    const inSecond = Number(seconds) + Number(timeArray[1] * 60) + Number(timeArray[0] * 60 * 60);
    const percent = parseFloat(`${inSecond}.${ms}`) / duration;
    process.stdout.write(`\r[${'#'.repeat((100 * percent).toFixed(0))}${'.'.repeat((100 - 100 * percent).toFixed(0))}] ${(percent * 100).toFixed(2)}% `);
  }
};

const hls = {
  /**
   *
   * @param {string} videoSourcePath
   * @returns {Promise<{hlsUrl: string, message: string}>}
   */
  async convertor(videoSourcePath) {
    infoLog('Start', 'HLS-Video-Converter');
    const paramTypes = {
      videoSourcePath: 'string',
    };
    checkParameters(paramTypes, { videoSourcePath }, CODES.HLS_INIT.code);

    const command = await ffmpegScript.HLSVideo(videoSourcePath);
    return new Promise((resolve, reject) => {
      const exc = exec(command.script, (err) => {
        if (err) {
          console.error(err);
          reject(new CustomError({ message: err.message, name: err.name, ...err, code: CODES.HLS_ERROR.code }));
        }
      });

      exc.stderr.on('data', async (data) => {
        videoConversionProgress(data, command.duration);
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
