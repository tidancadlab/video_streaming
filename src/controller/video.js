const { appendFile } = require('fs');
const { randomUUID } = require('crypto');

const config = require('../../config');
const { infoLog } = require('../logger');
const videoQueueItem = require('../queue');
const videoConversion = require('../ffmpeg');
const models = require('../Database/models');
const { joinPath, createDirectory } = require('../utils');
const { setVideoProfile, updateVideoProfile, deleteVideoProfile } = require('../Database/models/video');
const { get } = require('../Database/SQLMethod');

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

  const videoId = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id) ? id : randomUUID();
  const filename = `${config.FILENAME.VIDEO_ORIGINAL}.${extension}`;
  const videoDirectoryPath = joinPath(config.PATH.VIDEO_STORAGE, videoId);
  createDirectory(videoDirectoryPath);

  const videoItem = {
    filename,
    videoDirectoryPath,
    videoSourcePath: joinPath(videoDirectoryPath, filename),
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
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async searchVideo(req, res) {
    const { category = '' } = req.query;
    try {
      const result = await models.video.getVideos({ category });
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

  // <------------------- Video Profile --------------------------------------------->
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async setVideoProfile(req, res) {
    const { videoId, title, description, category, tags } = req.body;
    try {
      const isAlreadyCreated = await get('SELECT * from video_profile where video_id = ?', [videoId]);
      if (isAlreadyCreated) return res.status(409).send({ error: 'already exist' });
      const result = await setVideoProfile({ videoId, category, description, tags, title });
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
    return null;
  },

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async updateVideoProfile(req, res) {
    const { id, title, description, category, tags } = req.body;
    if (!id) return res.status(404).send({ error: 'id should be available for update Video profile' });

    try {
      const isAlreadyCreated = await get('SELECT * from video_profile where id = ?', [id]);
      if (!isAlreadyCreated) return res.status(404).send({ error: 'not exist' });
      const result = await updateVideoProfile({ id, title, description, category, tags });
      res.status(200).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
    return null;
  },
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async deleteVideoProfile(req, res) {
    const { id } = req.body;
    const { id: userId } = req.payload;
    try {
      const videoProfile = await get('SELECT * from video_profile where id = ? and user_id = ?', [id, userId]);
      if (!videoProfile) return res.status(401).send({ ok: false });
      const result = await deleteVideoProfile(id);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
    return null;
  },
};

module.exports = videoController;
