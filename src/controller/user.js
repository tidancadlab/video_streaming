const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const model = require("../Database/models");

const newUser = async (req, res) => {
  const { email, fullName, password } = req.body;
  const result = await model.user.register(email, password, fullName);
  if (result.ok) {
    res.status(200).send(result);
    return;
  }
  res.status(403).send(result);
};

const getUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await model.user.get(email);
  if (!user) {
    res.status(404).send({ message: "User not found" });
  } else {
    const checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      const token = jwt.sign({ id: user.id }, process.env.TOKENKEY);
      res.send({ message: "Welcome Back", token });
    } else {
      res.status(404).send({ message: "wrong password" });
    }
  }
};

module.exports = { newUser, getUser };
