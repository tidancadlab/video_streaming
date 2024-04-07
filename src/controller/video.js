const { appendFile } = require('fs');
const { randomUUID } = require('crypto');
const { videoConversion } = require('../ffmpeg/FfmpegConverter');
const models = require('../Database/models');
const Middleware = require('../Middleware');
const config = require('../../config');
const { generateIds, joinPath, createDirectory } = require('../utils');
const videoQueueItem = require('../helper/videoQueue');

const getVideoId = async (id) => (id.length < 20 ? randomUUID() : id);

const videoUpload = async (req, res) => {
  const { body, payload, file } = req;
  const { extension, id, isLast: isTail } = body;
  try {
    // checking id getting or not from front end if not then will create.
    const videoId = await getVideoId(id);
    const fileName = `${config.FILENAME.VIDEO_ORIGINAL}.${extension}`;
    const videoDirectoryPath = await joinPath(config.PATH.VIDEO_STORAGE, videoId);
    await createDirectory(videoDirectoryPath);
    const videoSourcePath = await joinPath(videoDirectoryPath, fileName);
    appendFile(videoSourcePath, Buffer.from(file.buffer), (err) => {
      if (err) {
        console.log(err);
      }
    });
    if (isTail === 'true') {
      const { streams, format } = await Middleware.video.getMeteData(videoSourcePath);
      const { height, width, r_frame_rate: frameRate, duration } = streams[0];
      const aspectRatio = width / height;
      await videoQueueItem.createItem(videoId, { videoDirectoryPath, aspectRatio, duration, fileName, height });
      await models.video.insert(id, payload.id, `${await joinPath(videoId, fileName)}`);
      await models.metaData.insert(randomUUID(), { id, ...streams[0], byte_size: format.size, frameRate });
      videoQueueItem.updateStatusCode(videoId, 200);
      videoConversion();
      res.send({ success: true, message: 'completed', videoSourcePath, id });
    } else {
      res.json({ id: videoId, time: Date.now() });
    }
  } catch (error) {
    console.log(error);
    res.json({ message: JSON.stringify(error) });
  }
};

const searchVideo = async (req, res) => {
  const result = await models.video.search();
  if (result.ok) {
    res.status(200).send(result);
    return;
  }
  res.status(403).send(result);
};

const videoById = async (req, res) => {
  const data = await models.video.getVideoById(req.params.id);
  if (data.ok) {
    res.send(data);
    return;
  }
  res.send('something went wrong');
};

module.exports = { videoUpload, searchVideo, generateIds, videoById };
