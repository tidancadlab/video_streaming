const route = require('express/lib/router');
const { searchVideo, videoById, setVideoProfile, updateVideoProfile, deleteVideoProfile } = require('../../controller/video');
const auth = require('../../auth');

const videos = route();

videos.route('/').get(searchVideo);
videos.route('/profile').post(auth, setVideoProfile).put(auth, updateVideoProfile).delete(auth, deleteVideoProfile);
videos.route('/player/:id').get(videoById);

module.exports = videos;
