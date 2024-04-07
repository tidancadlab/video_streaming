const Route = require('express/lib/router');
const { videoById } = require('../controller/video');
const videoQueueItem = require('../queue');

const testRoute = Route();

testRoute.route('/video/:id').get(videoById);
testRoute
  .route('/video/queue/:id')
  .post(async (req, res) => {
    const item = await videoQueueItem.createItem(req.params.id, req.body);
    console.log(item);
    res.send(item);
  })
  .delete(async (req, res) => {
    const item = await videoQueueItem.deleteItem(req.params.id);
    console.log(item);
    res.send(item);
  })
  .patch(async (req, res) => {
    const item = await videoQueueItem.updateStatusCode(req.params.id, req.query.bode);
    console.log(item);
    res.send(item);
  })
  .get(async (req, res) => {
    const item = await videoQueueItem.getVideoItem(req.params.id);
    console.log(item);
    res.send(item);
  });

module.exports = testRoute;
