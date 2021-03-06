const express = require('express');
const { required } = require('joi');
const router = express.Router();
const axios = require('axios')

const knex = require('../data/db');

var moment = require('moment-timezone'); // require
moment.locale('fr');

const mountLoginRoutes = require('../features/login/routes');
const mountLogoutRoutes = require('../features/logout/routes');
// const SendmailTransport = require('nodemailer/lib/sendmail-transport');


function isAuthenticated(req, res, next) {
  if (req.user && req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}


router.get('/', isAuthenticated, async (req, res) => {

	// console.log(req.session.user);

	const user = await knex('users');
	// console.log(user);
	
	const organisation = await knex('organisations');
	// console.log(organisation);

	var sensors = await knex('sensors').orderBy('id');

	for(var i in user){
		if (user[i].id == req.session.user.id){
			break;
		}
	}
	// console.log("i = ", i);
	const user_info = {id: req.session.user.id, nickname: user[i].nickname};

	for(var j in organisation){
		if (organisation[j].id == user[i].org_id){
			break;
		}
	}
	// console.log("j = ", j);
	const organisation_info = {id: organisation[j].id, name: organisation[j].name, adress: organisation[j].adress};
	// console.log("user_info: ", user_info);
	// console.log("organisation_info: ", organisation_info);

	 sensors.forEach(function(sensor) {
		sensor.last_event_date = moment(sensor.last_event_date).tz('Europe/Paris').format('LLLL');
	});


	res.render('pages/dashboard', {
		sensors: sensors,
		user: user_info,
		organisation: organisation_info,
		moment: moment
	});
});

router.post('/dysfonctionnement', async (req, res) => {
  	if (res.statusCode == 200)
	{	var alert2send = {'dev_eui':req.body.ID, "message":""};
		console.log(req.body);
		var sensor = await knex('sensors').select().where('dev_eui', req.body.ID).limit(1);
		var errSent = req.body.flexRadioDefault;
		switch (errSent) {
			case 'pasDeChuteDetecte':
				var addErr = sensor[0].err_no_fall_detected + 1;
				await knex('sensors').select().where('dev_eui', req.body.ID).update({'err_no_fall_detected': addErr});
				alert2send.message = "Pas de chute constat??e";
				break;
			case 'alertesIntempestives':
				var addErr = sensor[0].err_intempestive_alert + 1;
				await knex('sensors').select().where('dev_eui',req.body.ID).update({'err_intempestive_alert': addErr});
				alert2send.message = "Alertes intempestives";
				break;
			case 'chuteNonDetecte':
				var addErr = sensor[0].err_missed_fall + 1;
				await knex('sensors').select().where('dev_eui', req.body.ID).update({'err_missed_fall': addErr});
				alert2send.message = "La chute n'a pas ??t?? d??tect??";
				break;
			case 'autre':
				var errText = req.body.autreInfo;
				if(errText.length > 100){
					//G??n??rer une erreur
					req.session.messages = {
						errors: { invalidSize: "Le message est trop grand: 100 caract??res max."},
					};
					return res.redirect('/');
				}
				await knex('sensors').select().where('dev_eui', req.body.ID).update({'err_other': errText});
				alert2send.message = errText;
				break;
			default:
				console.log(`D??sol??, erreur inconnue ${expr}.`);
				break;
		}

		// send alert via http post
		axios.post('https://hook.integromat.com/ifxer2jtsbw20dsny4o7ca2gko4krgia', alert2send)

		//D??clanche le trigger
		await knex('sensors').select().where('dev_eui', req.body.ID).update({status: false});
		req.session.messages = {"info": "Le dysfonctionnement a ete pris en charge !"};
		res.redirect('/');
	}
});

router.post('/resetAlarm', async (req, res) => {
	if (res.statusCode == 200)
	{ 
    await knex('sensors').select().where('dev_eui', req.body.ID).update({status: false});
    // console.log("ANH: ", await knex('sensors').select().where('dev_eui', Buffer.from(req.body.ID, "hex")));
	var alert2send = {'dev_eui':req.body.ID, "message":"La chute a ??t?? valid??e sur la plateforme!"};
	// send alert via http post
	axios.post('https://hook.integromat.com/ifxer2jtsbw20dsny4o7ca2gko4krgia', alert2send);
    res.redirect('/');
  }
});

// const listenPSQL = require("../features/refresh/trigger");
// listenPSQL.connect();

// const mqtt_client = require("../features/mqtt/controller");

// let clients = [];

// var event = require('../features/refresh/event').eventBus;

// event.on("refresh", function () {
//     console.log('it worked');
//     clients.forEach(client => client.response.write(`data: ${JSON.stringify({ 'refresh': true })}\n\n`))
// });

// function eventsHandler(request, response, next) {
//     const headers = {
//         'Content-Type': 'text/event-stream',
//         // 'Connection': 'keep-alive',
//         'Cache-Control': 'no-cache',
// 		'X-Accel-Buffering': 'no'
//     };
//     response.writeHead(200, headers);

//     const clientId = Date.now();

//     const newClient = {
//         id: clientId,
//         response
//     };

//     clients.push(newClient);

//     request.on('close', () => {
//         console.log(`${clientId} Connection closed`);
//         clients = clients.filter(client => client.id !== clientId);
//     });
// }

// router.get('/events', eventsHandler);




mountLoginRoutes(router);
mountLogoutRoutes(router);

module.exports = router;
