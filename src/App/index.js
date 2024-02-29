const { static } = require('express');
const { PATH } = require('../../config');
const { login, register, upload, video } = require('../Routes');
const testRoute = require('../Routes/testRoute');
const { initializeTable } = require('../utils');
// initializeTable()

module.exports = async (app) => {
  app.use('/api/upload', upload);
  app.use('/api/video', video);
  app.use('/api/auth/register', register);
  app.use('/api/auth/login', login);
  app.use('/api/test', testRoute);
  app.use('/api/storage', static(PATH.VIDEO_STORAGE));
};
