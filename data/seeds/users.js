const bcrypt = require('bcrypt');

exports.seed = async function seed(knex) {
  const hashedPass = await bcrypt.hash('anh', 5);
  await knex('users').insert({
    name: 'anh',
    email: 'anh@thomaswatt.fr',
    password: hashedPass,
    created_at: new Date(),
    updated_at: new Date(),
    email_verified_at: new Date(),
  });
};
