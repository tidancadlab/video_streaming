const { static } = require('express');

const { PATH } = require('../../config');
const testRoute = require('../Routes/testRoute');
const { login, register, upload, video } = require('../Routes');

module.exports = async (app) => {
  app.use('/api/auth/login', login);
  app.use('/api/auth/register', register);
  app.use('/api/upload', upload);
  app.use('/api/video', video);
  app.use('/api/video/profile', video);
  app.use('/api/test', testRoute);
  app.use('/' + PATH.MEDIA_API_BASE, static(PATH.VIDEO_STORAGE));
};
