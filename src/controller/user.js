const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../Database/models');

const newUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  const result = await models.user.register(email, password, fullName);
  if (result.ok) {
    res.status(201).send(result);
    return;
  }
  res.status(403).send(result);
};

/**
 * @param {Response} res
 */
const getUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await models.user.get(email);
  if (!user) {
    res.status(404).send({ message: 'User not found' });
  } else {
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const token = jwt.sign({ id: user.id }, process.env.TOKENKEY);
      res.cookie('token', token, { httpOnly: true }).send({ message: 'Welcome Back', token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  }
};

module.exports = { newUser, getUser };
