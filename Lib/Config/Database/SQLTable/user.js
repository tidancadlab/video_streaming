const { randomUUID } = require('crypto');
const bcrypt = require('bcrypt');
const { all, run } = require('../dbSQL');

/**
 * This is a function use to add new user in user table thorough user `data` object
 * ```json
 * data = {
 *  "email" : "user email address",
    "password" : "user password",
    "fullName" : "user full name",
    "gender" : "user gender",
 * }
 * ```
 * @param {*} data the `object` where should be user details in key value pairs.
 * @returns status `object` of success or rejection error.
 */

exports.userInsert = async (data) => {
  const {
    id = randomUUID(),
    email,
    password,
    fullName,
    gender,
  } = data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `insert into user ( id, email, password, fullName, gender )
     values ( '${id}', '${email}', '${hashedPassword}', '${fullName}', '${gender}')`;
  try {
    await run(query);
    return {
      message: 'successfully registered',
      username: email,
      ok: true,
      date: Date(),
    };
  } catch (error) {
    return { message: 'something went wrong', ...error, ok: false };
  }
};
/**
 * this will find user through email address which is unique.
 * @param {*} email email address of user
 * @returns `Array` of user with id, full name, gender, email.
 */
exports.userGet = async (email) => {
  const query = `select id, fullName, email, gender from user where "email" like '${email}'`;
  try {
    const result = await all(query);
    return result;
  } catch (error) {
    return { error: `something went wrong ${JSON.stringify(error)}` };
  }
};

/**
 * it will delete user through user unique id
 * @param {*} id user unique id `XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX-XXXXXXX`
 * @returns `object` of status
 */
exports.userDelete = async (id) => {
  const query = `DELETE FROM user WHERE "id" ${id}`;
  try {
    const result = await run(query);
    return { message: 'user successfully deleted', ok: true, result };
  } catch (error) {
    return { message: 'something went wrong', ...error, ok: false };
  }
};
