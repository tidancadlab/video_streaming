const { hash } = require('bcrypt');
const { randomUUID } = require('crypto');
const { get, run } = require('../SQLMethod');

/**
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<{ok: boolean, message: string} | Error>}
 */

const userInsert = async (email, password, fullName) => {
  if (!email || !password || !fullName) {
    return {
      ok: false,
      message: 'Please provide email, password and fullName',
    };
  }

  const id = randomUUID();
  const timeStamp = Date.now();
  const hashedPassword = await hash(password, 10);

  const query = `insert into user ( id, email, password, full_name, time_stamp )
     values ( '${id}', '${email}', '${hashedPassword}', '${fullName}', ${timeStamp})`;
  try {
    await run(query);
    return {
      message: 'successfully registered',
      username: email,
      ok: true,
      date: Date(),
    };
  } catch (error) {
    return { message: error.message };
  }
};

/**
 * this will find user through email address which is unique.
 * @param {*} email email address of user
 * @returns `Array` of user with id, full name, gender, email.
 */
const userGet = async (email) => {
  const query = `select * from user where "email" like '${email}'`;
  try {
    const result = await get(query);
    return result;
  } catch (error) {
    return { error: `something went wrong ${JSON.stringify(error)}` };
  }
};

/**
 * it will delete user through user unique id
 * @param {string} id
 * @returns `object` of status
 */
const userDelete = async (id) => {
  const query = `DELETE FROM user WHERE "id" ${id}`;
  try {
    const result = await run(query);
    return { message: 'user successfully deleted', ok: true, result };
  } catch (error) {
    return { message: 'something went wrong', ok: false, result: error };
  }
};

module.exports = {
  register: userInsert,
  remove: userDelete,
  get: userGet,
};
