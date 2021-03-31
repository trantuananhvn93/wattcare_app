const bcrypt = require('bcrypt');

exports.seed = async function seed(knex) {
  await knex('organisations').insert({
    id: 1,
    name: 'Thomaswatt',
    address: null,
    created_at: new Date()
  });

  const hashedPass = await bcrypt.hash('anh', 5);
  await knex('users').insert({
    id:1,
    org_id: 1,
    name: 'anh',
    password: hashedPass,
    created_at: new Date()
  });

  await knex('sensors').insert({
    dev_eui: Buffer.from('96ae6715965eacef','hex'),
    org_id: 1,
    location: '369',
    error: 0,
    status: 1,
    created_at: new Date()
  });

  // await knex.raw(
  //   `
  //   INSERT INTO sensors(dev_eui, org_id, location)
  //   VALUES (decode('96ae6715965eacef', 'hex'), 1, 'chambre 369');
  //   `
  // );
};