// garage.js
require('dotenv').config();
const knex = require("../../data/db");

const mqtt = require('mqtt');
const match = require('mqtt-match');

var event = require('../refresh/event').eventBus;

const options = {
    port: process.env.TTN_PORT,
    host: process.env.TTN_HOST,
    username: process.env.TTN_USERNAME,
    password: process.env.TTN_PASSWORD,
};

const client = mqtt.connect(process.env.TTN_HOST, options);

client.on('connect', () => {
    console.log('Connected successfully to TTN...');
    client.subscribe('#');
});

client.on('close', () => {
    console.log('Connection closed');
});

client.on('error', err => {
    console.log('error', err);
});

client.on('message', (topic, message) => {
    console.log('received message %s', topic);
    if (match(process.env.TTN_TOPIC_UP, topic)) {
        handle_message_up(message);
        event.emit('refresh');
    }

});

async function handle_message_up(message) {
    var json = JSON.parse(message);
    const dev_eui = json.end_device_ids.dev_eui;
    const received_at = json.received_at;
    const payload = json.uplink_message.decoded_payload;
    const data = {
        dev_eui: dev_eui,
        bytes: payload.bytes,
        message: payload.message,
        created_at: received_at
    };
    console.log(data);
    await knex('events_up').insert(data);

    // update table sensor
    if (payload.message == "fall") {
        await knex('sensors').select().where('dev_eui', dev_eui).update({ 'status': true });        
    }
}


module.exports = client;