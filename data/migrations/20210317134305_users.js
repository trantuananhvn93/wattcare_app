exports.up = async function up(knex) {
  await knex.schema.createTable('organisations', table => {
    table
      .increments('id')
      .unsigned()
      .primary();
    table
      .string('name', 60)
      .notNullable();
    table.string('address', 150);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('users', table => {
    table
      .increments('id')
      .unsigned()
      .primary();
    table
      .integer('org_id')
      .unsigned()
      .notNullable();
    table
      .foreign('org_id')
      .references('id')
      .inTable('organisations')
      .onDelete("CASCADE");

    table
      .string('name', 60)
      .notNullable();
    table
      .string('password', 60)
      .notNullable();
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique('name');

  });

  await knex.schema.createTable('sensors', table => {
    table.binary('dev_eui').primary();
    table.integer('id').unsigned().notNullable();
    table.integer('org_id').unsigned().notNullable();
    table.foreign('org_id').references('id').inTable('organisations').onDelete("CASCADE");
    // table.integer('error').defaultTo(0);
    table.integer('err_no_fall_detected').defaultTo(0);
    table.integer('err_intempestive_alert').defaultTo(0);
    table.integer('err_missed_fall').defaultTo(0);
    table.string('err_other', 100);
    table.boolean('status').notNullable().defaultTo(1);
    table.string('location', 150);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique('id');
  });



  await knex.raw(
    `
CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
DECLARE
BEGIN
PERFORM pg_notify('alert_detected', json_build_object(
  'operation', TG_OP,
  'record', row_to_json(NEW)
  )::text);
RETURN new;
END;
$$ LANGUAGE plpgsql;
`,
  );

  // Assign trigger
  await knex.raw(`
CREATE TRIGGER sensors_changed AFTER INSERT OR UPDATE OF status ON sensors
FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
`);

};

exports.down = async function down(knex) {
  await knex.raw('DROP TRIGGER IF EXISTS sensors_changed ON sensors');
  await knex.raw('DROP FUNCTION IF EXISTS notify_trigger CASCADE');
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('sensors');
  await knex.schema.dropTable('organisations');
};