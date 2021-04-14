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
      .string('nickname', 150);

    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());

    table.unique(['name', 'org_id']);
  });

  await knex.schema.createTable('sensors', table => {
    table
      .increments('id')
      .unsigned()
      .primary();
    table.specificType('dev_eui', 'CHAR(16)');
    table.integer('org_id').unsigned().notNullable();
    table.foreign('org_id').references('id').inTable('organisations').onDelete("CASCADE");
    // table.integer('error').defaultTo(0);
    table.integer('err_no_fall_detected').defaultTo(0);
    table.integer('err_intempestive_alert').defaultTo(0);
    table.integer('err_missed_fall').defaultTo(0);
    table.string('err_other', 100).defaultTo('');
    table.boolean('status').notNullable().defaultTo(1);
    table.string('location', 150);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .timestamp('last_event_date')
      .defaultTo(knex.fn.now());      
    table.unique('dev_eui');
  });

  await knex.schema.createTable('events_up', table => {
    table.specificType('dev_eui', 'CHAR(16)');
    table.foreign('dev_eui').references('dev_eui').inTable('sensors').onDelete("CASCADE");
    table.specificType('bytes', 'INT[]');
    table.string('message', 150);
    table
      .timestamp('created_at')
      .notNullable()
      .defaultTo(knex.fn.now());
  });

  //   await knex.raw(
  //     `
  // CREATE FUNCTION notify_trigger() RETURNS trigger AS $$
  // DECLARE
  // BEGIN
  // PERFORM pg_notify('alert_detected', json_build_object(
  //   'operation', TG_OP,
  //   'record', row_to_json(NEW)
  //   )::text);
  // RETURN new;
  // END;
  // $$ LANGUAGE plpgsql;
  // `,
  //   );

  //   // Assign trigger
  //   await knex.raw(`
  // CREATE TRIGGER new_event AFTER INSERT ON events_up
  // FOR EACH ROW EXECUTE PROCEDURE notify_trigger();
  // `);


};

exports.down = async function down(knex) {
  // await knex.raw('DROP TRIGGER IF EXISTS new_event ON sensors');
  // await knex.raw('DROP FUNCTION IF EXISTS notify_trigger CASCADE');
  await knex.schema.dropTable('events_up');
  await knex.schema.dropTable('users');
  await knex.schema.dropTable('sensors');
  await knex.schema.dropTable('organisations');
};
