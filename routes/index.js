const express = require('express');
const { required } = require('joi');
const router = express.Router();

const knex = require('../data/db');

const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');


function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

const knex2 = require('knex');

const knexfile = require('../knexfile');

const knex_chirpstack = knex2(knexfile['testing']);


router.get('/', isAuthenticated, async (req, res) => {

  const user = await knex('users');
  //console.log(user);

  const organisation = await knex('organisations');
  //console.log(organisation);

  var sensors = await knex('sensors');
  // console.log(sensors);

  res.render('pages/dashboard', {
    sensors: sensors,
    user: user,
    organisation: organisation
  });

  console.log('Affichage dashboard !');
});

router.post('/dysfonctionnement', async (req, res) => {
  if (res.statusCode == 200)
	{
    var sensor = await knex('sensors').select().where('dev_eui', req.body.ID).limit(1);
    var err = sensor[0].error + 1;
    await knex('sensors').select().where('dev_eui', req.body.ID).update({'error': err});

    res.redirect('/');
  }
});

router.post('/resetAlarm', async (req, res) => {
  if (res.statusCode == 200)
	{ 
    await knex('sensors').select().where('dev_eui', req.body.ID).update({status: false});
    // console.log("ANH: ", await knex('sensors').select().where('dev_eui', Buffer.from(req.body.ID, "hex")));

    res.redirect('/');
  }
});

// const listenPSQL = require("../features/refresh/trigger");
// listenPSQL.connect();

const mqtt_client = require("../features/mqtt/controller");

// refresh page when trigger
let clients = [];

var event = require('../features/refresh/event').eventBus;

event.on("refresh", function () {
    console.log('it worked');
    clients.forEach(client => client.response.write(`data: ${JSON.stringify({ 'refresh': true })}\n\n`))
});

function eventsHandler(request, response, next) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        response
    };

    clients.push(newClient);

    request.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });
}

router.get('/events', eventsHandler);

mountLoginRoutes(router);
mountLogoutRoutes(router);

module.exports = router;
