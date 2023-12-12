const { Router } = require('express');
const Ffmpeg = require('fluent-ffmpeg');
const { upload } = require('../../Models/UploadHelper');
const { updateWaitingList, getWaitingList } = require('../../Models/FfmpegConverter/WaitingRoom');
const { toHLS, getMeteData } = require('../../Models/FfmpegConverter');
const { randomUUID } = require('crypto');

// variables
const router = Router();

router.post('/', upload.single('file'), getMeteData, async (req, res) => {
  try {
    const newWaitingItem = {
      id: randomUUID(),
      path: req.file.path,
      destination: req.file.destination,
    };
    await updateWaitingList(newWaitingItem)
      .then(() => getWaitingList())
      .then(async (data) => {
        await toHLS(data, req.file.streams[1].duration);
      });
    res.send({ success: true, message: 'completed' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/test', upload.single('file'), async (req, res) => {
  try {
    Ffmpeg.ffprobe(req.file.path, (err, data) => {
      req.file = { ...data, ...req.file };

      // dbConfig.run(`insert into video_meta_data values('${req.file.filename.split('.')[0]}', '${JSON.stringify(req.file)}')`, (er, row) => {
      //   if (er) {
      //     console.error(er);
      //   }
      //   console.info(row);
      // });
      console.log(req.file, 'inside');
    });
    console.log();
  } catch (error) {
    throw new Error(error);
  }
  // res.send('started');
  // await toHLS(req.file, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error: ${error.message}`);
  //     res.send(`error: ${error}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`stderr: ${stderr}`);
  //     res.send(`stderr: ${stderr}`);
  //     return;
  //   }
  //   console.info(stdout);
  //   res.send(`stdout: ${stdout}`);
  // });
});

router.get('/exc', async (req, res) => {
  getWaitingList(async (data) => {
    await toHLS(data);
  });
  res.send('started');
});

module.exports = router;
