exports.up = async function up(knex) {
  await knex.schema.createTable('users', table => {
    table
      .increments('id')
      .unsigned()
      .notNullable()
      .primary(['user_job_pkey']);
    table.string('email', 60).notNullable();
    table.string('name', 60).notNullable();
    table.string('password', 60).notNullable();
    table.timestamp('email_verified_at').defaultTo(knex.fn.now());
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('updated_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique('email');
  });


  await knex.raw(
    `
CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
PERFORM pg_notify('watchers', 'changed');
RETURN new;
END;
$$ LANGUAGE plpgsql;
`,
  );

  // Assign trigger
  await knex.raw(`
CREATE TRIGGER users_changed AFTER INSERT ON users
FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
`);

};

exports.down = async function down(knex) {
  await knex.raw('DROP TRIGGER IF EXISTS users_changed ON users');
  await knex.raw('DROP FUNCTION IF EXISTS notify_trigger CASCADE');
  await knex.schema.dropTable('users');
};
