const Router = require('express/lib/router');
const db = require('../Config/Database/dbConfig');

const router = Router();

router.get('/', async (req, res) => {
  db.all('select * from user', async (error, rows) => {
    if (error) {
      res.status(404).send(error);
      return;
    }
    res.send(rows);
  });
});

module.exports = router;
