const { appendFileSync } = require('fs');

const { infoLog } = require('../logger');
const videoQueueItem = require('../queue');
const videoConversion = require('../ffmpeg');
const models = require('../Database/models');
const { get } = require('../Database/SQLMethod');
const { createVideoEnvironment, items } = require('../helper/createVideoEnvironment');
const { setVideoProfile, updateVideoProfile, deleteVideoProfile } = require('../Database/models/video');

const videoController = {
  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @returns
   */
  async videoUpload(req, res) {
    if (req.body.isTail === 'false') {
      res.end();
    }
    try {
      const { body, file, payload } = req;
      const { id, isTail } = body;

      const { filename, videoDirectoryPath, videoSourcePath, videoId, hasThumbnail } = await createVideoEnvironment(id, file, body);

      appendFileSync(videoSourcePath, Buffer.from(file.buffer));

      if (isTail === 'true') {
        infoLog(`Video received and saved successfully - ${file.originalname}`, 'video-controller');
        res.json({
          id: videoId,
          ok: true,
        });

        await videoQueueItem.createItem(videoId, {
          videoDirectoryPath,
          filename,
          userId: payload.id,
          hasThumbnail,
        });

        videoConversion.init();
        delete items[videoId];
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: error.message, error_name: error.name });
    }
    return null;
  },

  // TODO: <---------------- Initialize Video Uploading Process in single without chunk -------------->
  async videoSingleUpload(req, res) {
    try {
      const { body, file, payload } = req;
      const { id } = body;

      const { filename, videoDirectoryPath, videoId, hasThumbnail } = await createVideoEnvironment(id, file, body);

      infoLog(`Video received and saved successfully - ${file.originalname}`, 'video-controller');
      res.json({
        id: videoId,
        ok: true,
      });

      await videoQueueItem.createItem(videoId, {
        videoDirectoryPath,
        filename,
        userId: payload.id,
        hasThumbnail,
      });

      videoConversion.init();
      delete items[videoId];
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
