const route = require('express/lib/router');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { loginUser } = require('../../Models/User');
const db = require('../../Config/Database/dbConfig');

const login = route();

login.post('/', loginUser, async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, PATCH, OPTIONS');
  res.header('Content-Type', 'application/json');
  const {
    email, password,
  } = req.body;
  const user = await new Promise((resolve) => {
    db.get(`select * from user where email = '${email}'`, (err, result) => {
      if (err) {
        res.status(404).send({ message: err.message });
        return;
      }
      resolve(result);
    });
  });
  if (!user) {
    res.status(404).send({ message: 'User not found' });
  } else {
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const token = jwt.sign({ userName: user.fullName, id: user.id }, process.env.TOKENKEY, { expiresIn: '1day' });
      // res.cookie('token', token, { httpOnly: false });
      res.send({ message: 'Welcome Back', token });
    } else {
      res.status(404).send({ message: 'wrong password' });
    }
  }
});

module.exports = login;
