const { validateUserData, isUserExist, loginUser } = require("./user");
const { getMeteData } = require("./video");

module.exports = {
  user: {
    validateUserData,
    isUserExist,
    loginUser,
  },
  video: {
    getMeteData,
  },
};
