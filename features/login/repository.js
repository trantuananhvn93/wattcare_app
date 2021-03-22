const bcrypt = require('bcrypt');

const knex = require("../../data/db");

async function getUserForLoginData(username, password) {
  const [user] = await knex('users').select().where('name', username).limit(1);

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  return { id: user.id };
}

async function getUserById(id) {
  const [user] = await knex('users')
    .select()
    .where('id', id)
    .limit(1);
  return user;
}

module.exports = {
  getUserForLoginData,
  getUserById,
};


