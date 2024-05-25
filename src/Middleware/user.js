const { user } = require("../Database/models");

const mailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/* eslint-disable no-useless-escape */
const validateUserData = (req, res, next) => {
  const { email, password, fullName } = req.body;
  if (!fullName || fullName.length < 2) {
    res.status(403).send({ message: "UserName should not be empty" });
  } else if (!email.match(mailRegex)) {
    res.status(403).send({
      message: "email should be correct for example - user@domain.com",
    });
  } else if (password.length < 8) {
    res.status(403).send({ message: "Password length should be more then 7" });
  } else {
    next();
  }
};

const isUserExist = async (req, res, next) => {
  const { email } = req.body;
  const result = await user.get(email);
  if (!result) {
    next();
    return;
  }
  res.status(400).send({ message: "user already registered" });
};

const loginUser = (req, res, next) => {
  const userParameter = {
    email: undefined,
    password: undefined,
    ...req.body,
  };
  if (!userParameter.password && !userParameter.email) {
    res.status(403).send({ message: "Email and Password section is empty." });
  } else if (!userParameter.password) {
    res.status(403).send({ message: "Password section is empty" });
  } else if (!userParameter.email) {
    res.status(403).send({ message: "Email section is empty" });
  } else if (!userParameter.email.match(mailRegex)) {
    res.status(403).send({
      message: "email should be correct for example - user@domain.com",
    });
  } else {
    next();
  }
};

module.exports = { validateUserData, loginUser, isUserExist };
