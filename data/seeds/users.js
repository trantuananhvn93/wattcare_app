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
    id: 1,
    org_id: 1,
    name: 'anh',
    password: hashedPass,
    nickname: "Anh is the BEST",
    created_at: new Date()
  });

  await knex('organisations').insert({
    id: 2,
    name: 'EHPAD Grenelle',
    address: null,
    created_at: new Date()
  });

  const hashedPass2 = await bcrypt.hash('Grenelle2021', 5);
  await knex('users').insert({
    id: 2,
    org_id: 2,
    name: 'grenelle',
    password: hashedPass2,
    nickname: 'Admin',
    created_at: new Date()
  });

  await knex('sensors').insert({
    id: 1,
    dev_eui: '007F37200735120A',
    org_id: 2,
    location: '369',
    status: 1,
    created_at: new Date()
  });

  await knex('sensors').insert({
    id: 2,
    dev_eui: '007F37200735121A',
    org_id: 1,
    location: '529',
    status: 1,
    created_at: new Date()
  });

  await knex('sensors').insert({
    id: 3,
    dev_eui: '007F37200735122A',
    org_id: 1,
    location: '759',
    status: 1,
    created_at: new Date()
  });

  await knex('sensors').insert({
    id: 4,
    dev_eui: '007F37200735123A',
    org_id: 1,
    location: '349',
    status: 1,
    created_at: new Date()
  });

  await knex('sensors').insert({
    id: 5,
    dev_eui: '007F37200735124A',
    org_id: 1,
    location: '369',
    status: 1,
    created_at: new Date()
  });


  await knex('events_up').insert({
    dev_eui: '007F37200735120A',
    bytes: [9],
    message: 'fall',
    created_at: new Date()
  });

  // await knex.raw(
  //   `
  // INSERT INTO sensors(dev_eui, org_id, location)
  // VALUES (decode('96ae6715965eacef', 'hex'), 1, 'chambre 369');
  //   `
  // );
};