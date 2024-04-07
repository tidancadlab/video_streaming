const { exec } = require('child_process');
const { ffmpegVideoHlsScript } = require('./Script/ScriptGenerator');
const { infoLog } = require('../logger');

const videoConversionProgress = (data, duration) => {
  const output = data.toString('utf8');
  const progressMatch = output.match(/time=(\d+:\d+:\d+\.\d+)/);
  if (progressMatch) {
    const currentTime = progressMatch[1];
    const timeArray = currentTime.split(':');
    const [seconds, ms] = timeArray[2].split('.');
    const inSecond = Number(seconds) + Number(timeArray[1] * 60) + Number(timeArray[0] * 60 * 60);
    return `${((parseFloat(`${inSecond}.${ms}`) / duration) * 100).toFixed(2)} % Completed [ ${`${parseFloat(`${inSecond}.${ms}`)} of ${duration}`} ]`;
  }
  return null;
};

const hlsConvertor = async (videoSource, destinationPath, videoDuration) => {
  if (!videoSource || !destinationPath || !videoDuration) return new Error(`3 parameter required`);
  const command = await ffmpegVideoHlsScript(videoSource, destinationPath);
  console.log(command);
  return new Promise((resolve, reject) => {
    try {
      const exc = exec(command);

      exc.stderr.on('data', async (data) => {
        const log = videoConversionProgress(data, videoDuration);
        if (log) {
          infoLog(log, 'HLS-stderr-data');
        }
      });

      exc.stdout.on('data', (data) => {
        const frame = Buffer.from(data).toString('base64');
        infoLog(frame, 'HLS-stdout-data');
      });

      exc.on('close', async (code) => {
        infoLog(`close code ${code}`, 'HLS-on-close');
        if (code === 0) {
          resolve({ ok: true, message: 'Video conversion completed' });
        } else {
          resolve({ ok: false, message: 'something went wrong' });
        }
      });

      exc.on('exit', async (code) => {
        infoLog(`exit code ${code}`, 'HLS-on-exit');
        if (code > 1) {
          resolve({ ok: false, message: 'Something went wrong' });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  hlsConvertor,
};
