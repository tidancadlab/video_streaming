const { exec } = require('child_process');
const { statSync } = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { infoLog } = require('../../logger');
const { timeStrToSeconds } = require('../../utils/timeStrToSec');
const { ffmpegVideoHlsScript } = require('../Script/ScriptGenerator');
const { createThumbnail } = require('../thumbnailGenerator');
const models = require('../../Database/models');
const { PATH } = require('../../../config');
const videoQueueItem = require('../../helper/videoQueue');
const { joinPath } = require('../../utils');
const { run } = require('../../Database/SQLMethod');

let underProgress = false;

const insertThumbnailInDB = async (imageList, videoObject) => {
  infoLog('adding in table', 'thumbnail-item-insert');
  const { id, aspectRatio, height } = videoObject;
  let result = {};
  const start = async (i = 0) => {
    try {
      const pictureHight = imageList[i].size === -1 ? height : imageList[i].size;
      const fileSize = statSync(path.join(PATH.VIDEO_STORAGE, imageList[i].url)).size;
      result = await models.thumbnail.insert(
        randomUUID(),
        id,
        await joinPath('api', 'storage', imageList[i].url),
        fileSize,
        pictureHight,
        aspectRatio * pictureHight
      );
      if (imageList.length > i + 1) {
        return start(i + 1);
      }
      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  };
  await start();
  return result;
};

const toHLS = async (videoDirPath, videoFileName, videoDuration) => {
  if (!videoDirPath || !videoFileName || !videoDuration) return new Error(`3 parameter required`);
  infoLog('video converter started', 'before-video-hls');
  const command = await ffmpegVideoHlsScript(videoDirPath, videoFileName);
  return new Promise((resolve, reject) => {
    try {
      const exc = exec(command);

      exc.stderr.on('data', async (data) => {
        const log = timeStrToSeconds(data, videoDuration);
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

const videoConversion = async () => {
  infoLog('video conversion start...', 'video Conversion');
  if (underProgress) return new Error('Please wait machine working on another video');
  underProgress = true;
  try {
    const videoItem = await videoQueueItem.getVideoItem();
    if (typeof videoItem === 'object') {
      const { id, videoDirectoryPath, fileName, duration } = videoItem;
      const videoSource = await joinPath(videoDirectoryPath, fileName);
      const imageList = await createThumbnail(videoSource, { size: [360, -1] });
      insertThumbnailInDB(imageList, videoItem).then((response) => {
        if (response.ok) {
          videoQueueItem.updateStatusCode(id, 300);
          toHLS(videoDirectoryPath, fileName, duration).then((result) => {
            if (result.ok) {
              run(`UPDATE video set path = "api/storage/${id}/hls/master.m3u8", is_relesed = "1" where id = "${id}"`);
              videoQueueItem.updateStatusCode(id, 400);
            } else {
              videoQueueItem.updateStatusCode(id, 401);
            }
            videoConversion();
          });
        }
      });
    } else {
      infoLog('All video converted', 'video Conversion');
    }
  } catch (error) {
    console.log(error);
    underProgress = false;
  }
  return null;
};

module.exports = {
  videoConversion,
};
