const Ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const { infoLog } = require('../Helper/console');
const { timeStrToSeconds } = require('../Helper/timeStrToSec');
const { ffmpegVideoHlsScript } = require('../Script/ScriptGenerator');
const { deleteItem, getWaitingItem, dumpItem } = require('./WaitingRoom');
const { generateThumbnails } = require('../Helper/ImageGenerator/thumbnailGenerator');

let underProgress = false;

/**
 *
 * @param {object} file file object should have folder name as id key and path as path key
 * @returns `Object`
 */
const snapShot = (file) => new Promise((resolve, reject) => {
  Ffmpeg(file.path)
    .on('end', () => {
      resolve({ message: 'Screenshots and color palette generated successfully.', ok: true });
    })
    .on('error', (error) => {
      reject(new Error({ message: 'something went wrong', error, ok: false }));
    })
    .output(`./lib/public/media/${file.id}/Images/Thumbnails/M%d.jpg`)
    .outputOptions('-q:v', '2', '-vf', 'fps=1/10,scale=-1:200,tile=4x4')
    .output(`./lib/public/media/${file.id}/Images/colors/color%d.png`)
    .run();
});

const getMeteData = (req, res, next) => {
  Ffmpeg.ffprobe(req.file.path, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.file = { ...data, ...req.file };
      next();
    }
  });
};

/**
 * @param {number} duration video total length for conversion progress calculation.
 * @param {object} file
 *
 * ```json
 * //This is a object type file information and should have below keys.
 *
 * file = {
 *    "id": "unique",
 *    "path": "file path",
 *    "destination": "where the video checks will save"
 * }
 * ```
 * @returns
 */

const toHLS = async (file, duration = 90) => {
  if (underProgress) { infoLog('The system is busy please wait', 'HLS'); return; }
  if (!file) { infoLog('No Data', 'HLS'); return; }
  try {
    const { path, destination } = file;
    const command = await ffmpegVideoHlsScript(path, destination);
    const exc = exec(command);
    //
    exc.on('close', (code) => {
      infoLog(`close code ${code}`, 'HLS');
      underProgress = false;
      infoLog(`${JSON.stringify(file)}`, 'HLS');
      generateThumbnails(file)
        .then((i) => deleteItem(i))
        .then((isDeleted) => {
          infoLog(`isItem Delete completed: ${isDeleted}`, 'HLS');
          return isDeleted ? getWaitingItem() : false;
        })
        .then((data) => data && toHLS(data));
    });
    exc.on('exit', async (code) => {
      infoLog(`exit code ${code}`, 'HLS');
      if (code > 1) {
        infoLog('Dumping Started', 'HLS');
        dumpItem(file)
          .then((id) => {
            infoLog(`transfer successfully in dump yard ${id}`);
            return id;
          })
          .then((id) => deleteItem(id))
          .then((data) => data && infoLog('deletion completed successfully'));
      }
    });
    // data listener which will console progress of completion and make progress status true.
    exc.stderr.on('data', async (data) => {
      const log = timeStrToSeconds(data, duration);
      infoLog(log, 'HLS');
      underProgress = true;
    });
    exc.stdout.on('data', (data) => {
      const frame = Buffer.from(data).toString('base64');
      infoLog(frame, 'HLS');
    });
  } catch (error) {
    console.error('error', error);
  }
};

module.exports = {
  toHLS, snapShot, getMeteData,
};
