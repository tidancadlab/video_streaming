const { userGet } = require('../../Config/Database/SQLTable/user');

/* eslint-disable no-useless-escape */
const registerUser = (req, res, next) => {
  const userParameter = {
    email: undefined, password: undefined, fullName: undefined, gender: undefined, ...req.body,
  };
  const unAvailable = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key of Object.keys(userParameter)) {
    if (userParameter[key] !== undefined) {
      // eslint-disable-next-line no-continue
      continue;
    }
    unAvailable.message += `${key} Required*`;
  }

  if (userParameter.fullName <= 0) {
    res.status(403).send({ message: 'UserName should not be empty' });
  } else if (userParameter.password.length < 8) {
    res.status(403).send({ message: 'Password should be more then 7 include number character and spacial character' });
  } else if (userParameter.gender === undefined || !(userParameter.gender.includes('male') || !userParameter.gender.includes('female'))) {
    res.status(403).send({ message: 'Gender should be Male or Female' });
  } else if (!userParameter.email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )) {
    res.status(403).send({ message: 'email should be correct for example - user@domain.com' });
  } else {
    next();
  }
};

const isUserExist = async (req, res, next) => {
  const { email } = req.body;
  const data = await userGet(email);
  if (data.length === 0) {
    next();
    return;
  }
  res.send({ message: 'user already registered' });
};

const loginUser = (req, res, next) => {
  const userParameter = {
    email: undefined, password: undefined, ...req.body,
  };
  if (!userParameter.password && !userParameter.email) {
    res.status(403).send({ message: 'Email and Password section is empty.' });
  } else if (!userParameter.password) {
    res.status(403).send({ message: 'Password section is empty' });
  } else if (!userParameter.email) {
    res.status(403).send({ message: 'Email section is empty' });
  } else if (!userParameter.email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  )) {
    res.status(403).send({ message: 'email should be correct for example - user@domain.com' });
  } else {
    next();
  }
};

module.exports = { registerUser, loginUser, isUserExist };
