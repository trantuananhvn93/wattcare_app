const knex = require("../../data/db")

var event = require('./event').eventBus;


function setupConnection(connection, knex) {
    connection.query('LISTEN alert_detected');
    connection.on('notification', (msg) => {
        console.log("received notification:", msg);
        event.emit('refresh');
    });

    connection.on('end', () => {
        reconnectClient(knex);
    });
    connection.on('error', (err) => {
    });
}

function listenToPSQL(){
    knex.client
        .acquireRawConnection()
        .then((connection) => {
            setupConnection(connection, knex);
        })
        .catch((e) => {
        });
};

function reconnectClient(knex) {
    const fn = setInterval(() => {
        try {
            knex.client
                .acquireRawConnection()
                .then((connection) => {
                    setupConnection(connection, knex);
                    clearInterval(fn);
                })
                .catch((e) => {
                });
            console.log('connected to DB');
        } catch (e) {
        }
    }, 3000);
}

exports.connect = listenToPSQL;