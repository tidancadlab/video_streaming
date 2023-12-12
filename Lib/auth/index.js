const jwt = require('jsonwebtoken');
require('dotenv').config();

class Auth {
  static async init(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(403);
      res.send({ message: 'Unauthorized Access' });
    } else {
      const [prefix, token] = authHeader.split(' ');
      if (prefix !== 'bearer') {
        res.status(403);
        res.send({ message: 'Not a correct way to pass the Key' });
        return;
      }
      try {
        const isAuthorized = jwt.verify(token, process.env.TOKENKEY);
        req.payload = isAuthorized;
        next();
      } catch (error) {
        res.status(403);
        res.send({ message: error.message });
      }
    }
  }
}

module.exports = Auth.init;
