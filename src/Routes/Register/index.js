const route = require('express/lib/router');
const { registerUser, isUserExist } = require('../../Middleware/User');
const { userInsert } = require('../../Database/models/user');

const register = route();

register.post('/', registerUser, isUserExist, async (req, res) => {
  const result = await userInsert(req.body);
  if (result.ok) {
    res.status(200).send(result);
    return;
  }
  res.status(403).send(result);
});

module.exports = register;
