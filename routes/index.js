const express = require('express');
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

  console.log('Affichage dashboard !');
});

router.post('/dysfonctionnement', async (req, res) => {
  if (res.statusCode == 200)
	{
    var capteur = await knex('capteurs').select().where('id', req.body.ID).limit(1);
    var dys = capteur[0].dysfonctionnement + 1;
    await knex('capteurs').select().where('id', req.body.ID).update({'dysfonctionnement': dys});

    res.redirect('/');
    // console.log(req.body.ID);
    // if(dysfonctionnement[(req.body.ID)-1]){
    //   dysfonctionnement[(req.body.ID)-1].compteur++;
    //   console.log("Nombre de dysfonctionnement du capteur: " + dysfonctionnement[(req.body.ID)-1].compteur);
    // }
    // else{
    //   console.log("Impossible de prendre en compte le dysfonctionnement du capteur: " + req.body.ID);
    //   console.log("Probleme de taille de variable");
    // }
    // res.redirect('/');
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


mountLoginRoutes(router);
mountLogoutRoutes(router);

module.exports = router;
