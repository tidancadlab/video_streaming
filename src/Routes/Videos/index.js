const route = require('express/lib/router');
const { searchVideo, videoById } = require('../../controller/video');
const auth = require('../../auth');

const videos = route();

videos.route('/').get(auth, searchVideo);
videos.route('/player/:id').get(auth, videoById);

module.exports = videos;
