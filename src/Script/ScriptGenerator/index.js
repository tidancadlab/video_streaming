const HLSVideo = require('./ffmpegHLS.script');

const ffmpegScript = {
  /**
   * @param {string} path path of source file
   * @param {string} numberOfThumbnails Quantity of picture which will generator
   * @param {string} destination Location where pictures will save in drive
   * @returns FFMPEG script for thumbnail
   */
  async ffmpegThumbnailScript(path, numberOfThumbnails, destination) {
    return `
    ffmpeg -ss 4 -i ${path} -vf "thumbnail,scale=640:360" -frames:v \
    ${numberOfThumbnails} -c:v h264_nvenc -vsync vfr -f image2 \
    ${destination}/images/thumb%d.jpg
    `;
  },
  HLSVideo,
};
module.exports = ffmpegScript;
