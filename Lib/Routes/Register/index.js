const route = require('express/lib/router');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const { registerUser } = require('../../Models/User');
const db = require('../../Config/Database/dbConfig');

const register = route();

register.post('/', registerUser, async (req, res) => {
  const {
    id = randomUUID(), email, password, fullName, gender,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `insert into user ( id, email, password, fullName, gender )
     values ( '${id}', '${email}', '${hashedPassword}', '${fullName}', '${gender}')`;
  db.run(query, (err) => {
    if (err) {
      res.status(403).send(err);
      return;
    }
    res.status(200).send({ message: 'Successfully Registered' });
  });
});

module.exports = register;
