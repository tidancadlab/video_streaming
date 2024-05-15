require('dotenv').config();

// Please set environment variable into .env
module.exports = {
  PATH: {
    VIDEO_STORAGE: process.env.VIDEO_STORAGE, // where you want store Original video, HLS files and thumbnails
    MEDIA_API_BASE: process.env.MEDIA_API_BASE, // end point of static media file like https://domain.com/api/media/movie_id/hls/master.m3u8
  },
  URL: {
    SERVER_BASE_URL: process.env.SERVER_BASE_URL, // Domain of your server API example: https://api.domain.com
  },
  FOLDERNAME: {
    THUMBNAIL: 'thumbnail', // name of directory where thumbnail will store
  },
  FILENAME: {
    VIDEO_ORIGINAL: 'original', // name of source video file
  },
};
