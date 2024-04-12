const user = require('./user');
const video = require('./video');
const metaData = require('./videoMetaData');
const thumbnail = require('./thumbnail');
const hlsVideo = require('./hls_video');

module.exports = {
  user,
  metaData,
  video,
  thumbnail,
  hlsVideo,
};
