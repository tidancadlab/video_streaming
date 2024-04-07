const route = require('express/lib/router');
const { searchVideo } = require('../../controller/video');
const auth = require('../../auth');

const videos = route();

videos.route('/').get(auth, searchVideo);

module.exports = videos;
