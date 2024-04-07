const login = require('./Login');
const video = require('./Videos');
const upload = require('./Upload');
const register = require('./Register');
const testRoute = require('./testRoute');

const appRoute = {
  register,
  login,
  upload,
  video,
  testRoute,
};

module.exports = appRoute;
