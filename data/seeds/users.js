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
    id: 1,
    org_id: 1,
    location: '369',
    error: 0,
    status: 1,
    created_at: new Date()
  });

  await knex('sensors').insert({
    dev_eui: Buffer.from('96ae6715965eacff','hex'),
    id: 2,
    org_id: 1,
    location: '333',
    error: 0,
    status: 1,
    created_at: new Date()
  });

  await knex('sensors').insert({
    dev_eui: Buffer.from('96ae6715965eacee','hex'),
    id: 3,
    org_id: 1,
    location: '666',
    error: 0,
    status: 1,
    created_at: new Date()
  });

 
};