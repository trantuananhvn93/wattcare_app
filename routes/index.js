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

// /* GET home page. */
router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/index');
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const users = await knex('users');
  res.render("pages/dashboard", { users: users });
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
