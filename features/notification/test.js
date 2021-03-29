const knex = require('../../data/db');

async function connect() {
    const connection = await knex.client.acquireConnection();
    connection.query('LISTEN alert_detected');
    connection.on('notification', (msg) => {
        // console.log(msg);
        let payload = JSON.parse(msg.payload);
        // console.log(payload.record.status);
        //refesh page

        return payload.record.status;
    });
}
exports.connect = connect();