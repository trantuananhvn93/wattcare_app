const express = require('express');
const { required } = require('joi');
const router = express.Router();

const knex = require('../data/db');

const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');


function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}


router.get('/', isAuthenticated, async (req, res) => {

  const user = await knex('users');
  //console.log(user);

  const organisation = await knex('organisations');
  //console.log(organisation);

  var sensors = await knex('sensors').orderBy('id');
  

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
		console.log(req.body);
		var sensor = await knex('sensors').select().where('dev_eui', req.body.ID, "hex").limit(1);
		var errSent = req.body.flexRadioDefault;
		switch (errSent) {
			case 'pasDeChuteDetecte':
				var addErr = sensor[0].err_no_fall_detected + 1;
				await knex('sensors').select().where('dev_eui', req.body.ID, "hex").update({'err_no_fall_detected': addErr});
				break;
			case 'alertesIntempestives':
				var addErr = sensor[0].err_intempestive_alert + 1;
				await knex('sensors').select().where('dev_eui',req.body.ID, "hex").update({'err_intempestive_alert': addErr});
				break;
			case 'chuteNonDetecte':
				var addErr = sensor[0].err_missed_fall + 1;
				await knex('sensors').select().where('dev_eui', req.body.ID, "hex").update({'err_missed_fall': addErr});
				break;
			case 'autre':
				var errText = req.body.autreInfo;
				if(errText.length > 100){
					//Générer une erreur
					req.session.messages = {
						errors: { invalidSize: "Le message est trop grand: 100 caractères max."},
					};
					return res.redirect('/');
				}
				await knex('sensors').select().where('dev_eui', Buffer.from(req.body.ID, "hex")).update({'err_other': errText});
				break;
			default:
				console.log(`Désolé, erreur inconnue ${expr}.`);
				break;
		}
		//Déclanche le trigger
		// await knex('sensors').select().where('dev_eui', Buffer.from(req.body.ID, "hex")).update({status: false});
		req.session.messages = {"info": "Le dysfonctionnement a ete pris en charge !"};
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

// router.get('/events', eventsHandler);

mountLoginRoutes(router);
mountLogoutRoutes(router);

module.exports = router;
