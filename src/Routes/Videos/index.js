const route = require('express/lib/router');
const { getVideos } = require('../../Config/Database/SQLTable/video');

const videos = route();

// TODO: "implement the functionality"
videos.post('/', async (req, res) => {
  const result = await getVideos();
  if (result.ok) {
    res.status(200).send(result);
    return;
  }
  res.status(403).send(result);
});

module.exports = videos;
