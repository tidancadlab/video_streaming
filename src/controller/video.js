const { appendFile } = require('fs');
const { randomUUID } = require('crypto');
const { videoConversion } = require('../ffmpeg/FfmpegConverter');
const { updateWaitingList } = require('../ffmpeg/FfmpegConverter/WaitingRoom');
const { mkDir } = require('../utils/simpleFunction');
const models = require('../Database/models');
const Middleware = require('../Middleware');
const config = require('../../config');
const { generateIds } = require('../utils');

const videoId = async (id) => (id.length < 20 ? randomUUID() : id);

const videoUpload = async (req, res) => {
  try {
    const { body, payload, file } = req;
    const id = await videoId(body.id);
    await mkDir(`${config.PATH.VIDEO_STORAGE}/${id}/thumbnails`);
    const source = `${config.PATH.VIDEO_STORAGE}/${id}/original.${body.extension}`;
    const path = id;
    appendFile(source, Buffer.from(file.buffer), (err) => {
      if (err) {
        res.status(500).send({ err });
      }
    });
    if (req.body.isLast === 'true') {
      const { streams, format } = await Middleware.video.getMeteData(source);
      const { height, width, r_frame_rate, duration } = streams[0];
      const { videosId, metaId, thumbnailId, watchId } = await generateIds('videosId', 'metaId', 'thumbnailId', 'watchId');
      const aspectRatio = width / height;
      const videoItem = await updateWaitingList(id, { tables: { videosId, metaId, thumbnailId, watchId }, source, path, duration, aspectRatio, height });
      await models.video.insert(videosId, payload.id, `storage/${id}/hls/master.m3u8`, `${id}/original.${body.extension}`);
      await models.metaData.insert(metaId, { videosId, ...streams[0], byte_size: format.size, frame_rate: r_frame_rate });
      videoConversion(videoItem);
      res.send({ success: true, message: 'completed', source, videosId });
    } else {
      res.json({ id, time: Date.now() });
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

module.exports = { videoUpload, searchVideo, generateIds };
