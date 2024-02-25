const { login, register, upload, video } = require("../Routes");
const { initializeTable } = require("../utils");
// initializeTable()

module.exports = async (app) => {
  app.use("/api/upload", upload);
  app.use("/api/video", video);
  app.use("/api/auth/register", register);
  app.use("/api/auth/login", login);
};
