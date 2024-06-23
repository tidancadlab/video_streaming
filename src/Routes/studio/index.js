const route = require('express/lib/router');
const auth = require('../../auth');
const studioController = require('../../controller/studio');

const studio = route();

studio.route('/videos/').get(auth, studioController);

studio.route('/progress/').get((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  let count = 10;
  const time = setInterval(() => {
    if (count === 0) {
      clearInterval(time);
      res.end();
    }
    res.write(
      `data: ${JSON.stringify({
        mess: 'msg',
      })}\n\n`,
    );
    count -= 1;
  }, 1000);
});

module.exports = studio;
