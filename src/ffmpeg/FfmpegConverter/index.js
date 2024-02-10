const Ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const { infoLog } = require('../../logger');
const { timeStrToSeconds } = require('../../utils/timeStrToSec');
const { ffmpegVideoHlsScript } = require('../Script/ScriptGenerator');
const { deleteItem, getWaitingItem, dumpItem } = require('./WaitingRoom');
const { generateThumbnails } = require('../../ffmpeg/ImageGenerator/thumbnailGenerator');

let underProgress = false;

/**
 *
 * ```javascript
 * .output(`./lib/public/media/${dirname}/Images/Thumbnails/M%d.jpg`);
 * .output(`./lib/public/media/${dirname}/Images/colors/color%d.png`);
 * ```
 * @param {string} dirname Will create this name folder inside `lib/public/media` directory.
 * @param {string} path Source Video path.
 * @returns { Promise<{message: string, ok: boolean} | error>}
 */
const snapShot = (dirname, path) => new Promise((resolve, reject) => {
  Ffmpeg(path)
    .on('end', () => {
      resolve({ message: 'Screenshots and color palette generated successfully.', ok: true });
    })
    .on('error', (error) => {
      reject(new Error({ message: 'something went wrong', error, ok: false }));
    })
    .output(`./lib/public/media/${dirname}/Images/Thumbnails/M%d.jpg`)
    .outputOptions('-q:v', '2', '-vf', 'fps=1/10,scale=-1:200,tile=4x4')
    .output(`./lib/public/media/${dirname}/Images/colors/color%d.png`)
    .run();
});

/**
 * @param {object} file
 * @returns {boolean | Promise<boolean | error>}
 */

const toHLS = async (file) => {
  if (!file) return false;
  const {
    id,
    path,
    destination,
    duration,
  } = file;
  const command = await ffmpegVideoHlsScript(path, destination);
  return new Promise((resolve, reject) => {
    try {
      const exc = exec(command);

      exc.stderr.on('data', async (data) => {
        const log = timeStrToSeconds(data, duration);
        if (log) {
          infoLog(log, 'HLS-stderr-data');
        }
        underProgress = true;
      });

      exc.stdout.on('data', (data) => {
        const frame = Buffer.from(data).toString('base64');
        infoLog(frame, 'HLS-stdout-data');
      });

      exc.on('close', async (code) => {
        infoLog(`close code ${code}`, 'HLS-on-close');
        underProgress = false;
        const result = await deleteItem(id);
        resolve(result);
      });

      exc.on('exit', async (code) => {
        infoLog(`exit code ${code}`, 'HLS-on-exit');
        if (code > 1) {
          infoLog('Dumping Started', 'HLS-on-exit');
          dumpItem(file)
            .then((isTransferred) => isTransferred && deleteItem(id));
        }
        resolve(false);
      });
    } catch (error) {
      reject(error);
    }
  });
};

const videoConversion = async () => {
  if (underProgress) return false;
  underProgress = true;
  return new Promise((res, rej) => {
    try {
      getWaitingItem()
        .then((data) => toHLS(data))
        .then(() => videoConversion());
    } catch (error) {
      underProgress = false;
      rej(error);
    }
  });
};

module.exports = {
  toHLS, snapShot, videoConversion,
};
