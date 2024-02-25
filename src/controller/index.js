const { newUser, getUser } = require("./user");
const { videoUpload } = require("./video");

module.exports = {
  user: {
    newUser,
    getUser,
  },
  video: {
    videoUpload,
  },
};
