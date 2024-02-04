const { ffprobe } = require('fluent-ffmpeg');

exports.getMeteData = (req, res, next) => {
  ffprobe(req.file.path, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      req.file = { ...data, ...req.file };
      next();
    }
  });
};
