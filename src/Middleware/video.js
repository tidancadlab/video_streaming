const { ffprobe } = require('fluent-ffmpeg');

exports.getMeteData = async (req, path) => new Promise((resolve, reject) => {
  ffprobe(path, (err, data) => {
    if (err) {
      console.error(err);
      reject(err);
      return;
    }
    resolve({ ...data, ...req.file });
  });
});
