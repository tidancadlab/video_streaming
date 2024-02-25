const { ffprobe } = require("fluent-ffmpeg");

exports.getMeteData = async (source) => new Promise((resolve, reject) => {
  ffprobe(source, (err, data) => {
    if (err) {
      console.error(err);
      reject(err);
      return;
    }
    resolve(data);
  });
});
