const {
  login,
  register,
  upload,
  auth,
  video,
} = require('../Routes');
const test = require('../../Test')

module.exports = async (app) => {
  app.use('/api/upload', upload);
  app.use('/api/video', video);
  app.use('/api/auth/register', register);
  app.use('/api/auth/login', login);
  app.use('/api/test', test)
};
