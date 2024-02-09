const multer = require('multer');
const { appendFile, mkdirSync, existsSync } = require('fs');
const { Router } = require('express');
const Ffmpeg = require('fluent-ffmpeg');
const { randomUUID } = require('crypto');
const { toHLS, videoConversion } = require('../../Models/FfmpegConverter');
const dbConfig = require('../../Config/Database/dbConfig');
const { getMeteData } = require('../../Models/Middleware/video');
const { insertVideoMetaData } = require('../../Config/Database/SQLTable/videoMetaData');
const { updateWaitingList, getWaitingList } = require('../../Models/FfmpegConverter/WaitingRoom');

// variables
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uuid = async (id) => (id.length < 20 ? randomUUID() : id);

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const id = await uuid(req.body.id);
    const videoChunkBuffer = req.file.buffer;
    if (!existsSync(`./test/${id}`)) {
      mkdirSync(`./test/${id}`);
    }
    const path = `./test/${id}/original.${req.body.extension}`;
    appendFile(
      path,
      Buffer.from(videoChunkBuffer),
      (err) => {
        if (err) {
          res.status(500).send({ err });
        }
      },
    );
    if (req.body.isLast === 'true') {
      const metaData = await getMeteData(req, path);
      req.file = { ...req.file, ...metaData, buffer: '' };
      const newWaitingItem = {
        id,
        thumbnailId: randomUUID(),
        watchId: randomUUID(),
        metaId: randomUUID(),
        videoId: randomUUID(),
        path,
        destination: `./test/${id}`,
        duration: req.file.streams[1].duration,
      };
      insertVideoMetaData(newWaitingItem.metaId, JSON.stringify(req.file))
        .then((data) => data.ok && updateWaitingList(newWaitingItem))
        .then(() => videoConversion());
      res.send({ success: true, message: 'completed' });
    } else {
      res.json({
        id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/test', upload.single('file'), async (req, res) => {
  try {
    Ffmpeg.ffprobe(req.file.path, (err, data) => {
      req.file = { ...data, ...req.file };

      dbConfig.run(`insert into video_meta_data values('${req.file.filename.split('.')[0]}', '${JSON.stringify(req.file)}')`, (er, row) => {
        if (er) {
          console.error(er);
        }
        console.info(row);
      });
      console.info(req.file, 'inside');
    });
  } catch (error) {
    throw new Error(error);
  }
  res.send('started');
  await toHLS(req.file, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      res.send(`error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      res.send(`stderr: ${stderr}`);
      return;
    }
    console.info(stdout);
    res.send(`stdout: ${stdout}`);
  });
});

router.get('/exc', async (req, res) => {
  getWaitingList(async (data) => {
    await toHLS(data);
  });
  res.send('started');
});

module.exports = router;
