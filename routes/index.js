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

  var capteurs = await knex('capteurs').orderBy('id');
  //console.log(capteurs);


  res.render('pages/dashboard', {
    capteurs: capteurs,
    user: user,
    organisation: organisation
  });
  // console.log(req.flash('message'));
  console.log('Affichage dashboard !');
});

router.post('/dysfonctionnement', async (req, res) => {
  if (res.statusCode == 200)
	{
    //traitement pour la base de donnée
    var capteur = await knex('capteurs').select().where('id', req.body.ID).limit(1);
    var dys = capteur[0].dysfonctionnement + 1;
    await knex('capteurs').select().where('id', req.body.ID).update({'dysfonctionnement': dys});

    req.session.messages = {"info": "Le dysfonctionnement a ete pris en charge !"};
    res.redirect('/');
  }
});

router.post('/resetAlarm', async (req, res) => {
  if (res.statusCode == 200)
	{
    await knex('capteurs').select().where('id', req.body.ID).update({status: 'OK'});
    console.log(await knex('capteurs').select().where('id', req.body.ID));
    res.redirect('/');
  }
});

const listenPSQL = require("../features/refresh/trigger");
listenPSQL.connect();


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
