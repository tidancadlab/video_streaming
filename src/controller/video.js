const { appendFile } = require('fs');
const { randomUUID } = require('crypto');
const config = require('../../config');
const { joinPath, createDirectory } = require('../utils');
const models = require('../Database/models');
const videoQueueItem = require('../queue');
const { infoLog } = require('../logger');
const videoConversion = require('../ffmpeg');

// Object to store video data temporarily
const items = {};

/**
 * @param {string} id
 * @param {string} extension
 * @returns {Promise<{filename: string, videoDirectoryPath: string, videoSourcePath: string, videoId: string}>}
 * @description Creates a new video directory for the specified video directory path and video source path.
 */
const createVideoData = async (id, extension) => {
  if (typeof extension !== 'string') throw new Error('Second parameter "extension" should be of type string.');
  if (typeof id !== 'string') throw new Error('First parameter "id" should be of type string.');

  const item = items[id];
  if (item) return { videoId: id, ...item };

  const videoId = randomUUID();
  const filename = `${config.FILENAME.VIDEO_ORIGINAL}.${extension}`;
  const videoDirectoryPath = await joinPath(config.PATH.VIDEO_STORAGE, videoId);
  createDirectory(videoDirectoryPath);

  const videoItem = {
    filename,
    videoDirectoryPath,
    videoSourcePath: await joinPath(videoDirectoryPath, filename),
  };

  items[videoId] = videoItem;
  return { videoId, ...videoItem };
};

/**
 *
 * @param {string} filename
 * @returns
 */
const getFileExtension = (filename) => filename.split('.').pop();

const videoController = {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns
   */
  async videoUpload(req, res) {
    try {
      const { body, file, payload } = req;
      const { id, isTail } = body;
      const extension = getFileExtension(file.originalname);

      if (!extension || !['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension.toLowerCase())) {
        return res.status(415).json({ ok: false, message: `The file extension .${extension} is not supported. It must be mp4, mov, or avi.` });
      }
      const { filename, videoDirectoryPath, videoSourcePath, videoId } = await createVideoData(id, extension);
      appendFile(videoSourcePath, Buffer.from(file.buffer), (err) => {
        if (err) {
          throw err;
        }
      });

      if (isTail === 'true') {
        infoLog(`Video received and saved successfully - ${file.originalname}`, 'video-controller');
        res.json({
          id: videoId,
          ok: true,
          message: 'Full video received and saved successfully in the database.',
          videoSourcePath: `${config.PATH.MEDIA_API_BASE}/${joinPath(videoId, filename)}`,
        });

        await videoQueueItem.createItem(videoId, {
          videoDirectoryPath,
          filename,
          userId: payload.id,
        });
        videoConversion.init();
        delete items[videoId];
        console.log('item deleted', items);
      } else {
        res.send(videoId);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: error.message, error_name: error.name });
    }
    return null;
  },

  // <---------------- Video search controller start ------------------->
  async searchVideo(req, res) {
    try {
      const result = await models.video.getVideos();
      res.status(result.ok ? 200 : 403).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
    }
  },

  // <------------------- Video search by id controller start ------------------->
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async videoById(req, res) {
    try {
      const data = await models.video.getVideoById(req.params.id);
      res.status(data.ok ? 200 : 500).send(data.ok ? data : 'Something went wrong.');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error.');
    }
  },
};

module.exports = videoController;
