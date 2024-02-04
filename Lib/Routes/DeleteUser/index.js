const route = require('express/lib/router');
const { isUserExist } = require('../../Models/User');
const { userInsert } = require('../../Config/Database/SQLTABLE/user');

const register = route();

register.post('/', isUserExist, async (req, res) => {
  const result = await userInsert(req.body);
  if (result.ok) {
    res.status(200).send(result);
    return;
  }
  res.status(403).send(result);
});

module.exports = register;
