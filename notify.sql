await knex.raw(
    `
    CREATE OR REPLACE FUNCTION notify_capteur_changes()
    RETURNS trigger AS $$
    BEGIN
    PERFORM pg_notify(
        'alert_detected',
        json_build_object(
        'operation', TG_OP,
        'record', row_to_json(NEW)
        )::text
    );

    RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    `,
);

  await knex.raw(`
CREATE TRIGGER notify_capteur_changes
AFTER INSERT OR UPDATE
ON public.capteurs
FOR EACH ROW
EXECUTE PROCEDURE notify_capteur_changes()
  `);
}