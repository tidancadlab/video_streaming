const Route = require("express/lib/router");
const Middleware = require("../../Middleware");
const controller = require("../../controller");

const register = Route();

register
  .route("/")
  .post(
    [Middleware.user.validateUserData, Middleware.user.isUserExist],
    controller.user.newUser,
  );

module.exports = register;
