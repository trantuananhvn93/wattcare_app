// garage.js
require('dotenv').config();
const knex = require("../../data/db");
const axios = require('axios');
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
        //send alert via http post
        var alert2send = { "dev_eui": dev_eui, "message": "Une chute a été détectée" };
        axios.post('https://hook.integromat.com/ifxer2jtsbw20dsny4o7ca2gko4krgia', alert2send)

        await knex('sensors').select().where('dev_eui', dev_eui).update({ 'status': true, 'last_event_date': received_at });
        event.emit('refresh');
    }
    else if (payload.message == "active") {
        await knex('sensors').select().where('dev_eui', dev_eui).update({ 'last_event_date': received_at });
    }
}


module.exports = client;