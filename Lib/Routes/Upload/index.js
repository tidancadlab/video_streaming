const multer = require('multer');
const { Router } = require('express');
const Ffmpeg = require('fluent-ffmpeg');
const { randomUUID } = require('crypto');
const { toHLS } = require('../../Models/FfmpegConverter');
const dbConfig = require('../../Config/Database/dbConfig');
const { getMeteData } = require('../../Models/Middleware/video');
const { insertVideoMetaData } = require('../../Config/Database/SQLTable/videoMetaData');
const { updateWaitingList, getWaitingList } = require('../../Models/FfmpegConverter/WaitingRoom');

// variables
const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('video'), getMeteData, async (req, res) => {
  try {
    const newWaitingItem = {
      id: randomUUID(),
      thumbnailId: randomUUID(),
      watchId: randomUUID(),
      metaId: randomUUID(),
      videoId: randomUUID(),
      path: req.file.path,
      destination: req.file.destination,
      duration: req.file.streams[1].duration,
    };
    insertVideoMetaData(newWaitingItem.metaId, JSON.stringify(req.file))
      .then((data) => data.ok && updateWaitingList(newWaitingItem))
      .then((ok) => ok && getWaitingList())
      .then((data) => toHLS(data, newWaitingItem.destination));
    res.send({ success: true, message: 'completed' });
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
