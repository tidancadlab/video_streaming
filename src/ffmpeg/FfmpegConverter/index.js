const { exec } = require('child_process');
const { statSync } = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { infoLog } = require('../../logger');
const { timeStrToSeconds } = require('../../utils/timeStrToSec');
const { ffmpegVideoHlsScript } = require('../Script/ScriptGenerator');
const { deleteItem, getWaitingItem, updateWaitingList } = require('./WaitingRoom');
const { thumbnail } = require('../thubmnailGenrater');
const models = require('../../Database/models');
const { PATH } = require('../../../config');

let underProgress = false;

const addThumbnailInDB = async (imageList, videoObject) => {
  infoLog('adding in table', 'thumbnail-item-insert');
  const { tables, aspectRatio, height } = videoObject;
  let result = {};
  const start = async (i = 0) => {
    try {
      const pictureHight = imageList[i].size === -1 ? height : imageList[i].size;
      const fileSize = statSync(path.join(PATH.VIDEO_STORAGE, imageList[i].url)).size;
      result = await models.thumbnail.insert(randomUUID(), tables.videosId, path.join('storage', imageList[i].url), fileSize, pictureHight, aspectRatio * pictureHight);
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

const toHLS = async (videoSource, destinationPath, videoDuration) => {
  if (!videoSource || !destinationPath || !videoDuration) return new Error(`3 parameter required`);
  const command = await ffmpegVideoHlsScript(videoSource, destinationPath);
  console.log(command);
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

const videoConversion = async (vItem) => {
  infoLog('called', 'videoConversion');
  if (underProgress) return new Error('Please wait machine working on another video');
  underProgress = true;
  try {
    const videoItem = (await getWaitingItem()) || vItem;
    console.log(videoItem);
    if (typeof videoItem === 'object') {
      infoLog('thumbnail generator going to start', 'before function');
      const imageList = await thumbnail(videoItem.source, { size: [360, -1] });
      infoLog('thumbnail generator end', 'before function');
      console.log(imageList);
      addThumbnailInDB(imageList, videoItem).then((response) => {
        console.log(response);
        if (response.ok) {
          infoLog('video converter started', 'before-video-hls');
          toHLS(videoItem.source, videoItem.path, videoItem.duration).then((result) => {
            infoLog(underProgress, 'status of converter');
            if (result.ok) {
              deleteItem(videoItem.id);
            } else {
              updateWaitingList(videoItem.id, { hasError: true, message: 'something went wrong' });
            }
          });
        }
      });
    } else {
      return new Error('something went wrong in Snapshot');
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
