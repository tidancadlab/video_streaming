const route = require("express/lib/router");
const controller = require("../../controller");
const Middleware = require("../../Middleware");

const login = route();

login.route("/").post(Middleware.user.loginUser, controller.user.getUser);

module.exports = login;
