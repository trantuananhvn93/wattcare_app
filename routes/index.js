const express = require('express');

const router = express.Router();

const knex = require('../data/db');


// /* GET home page. */
// router.get('/', (req, res) => {
//   res.render('pages/index');
// });

router.get('/', async (req, res, next) => {

  const user = await knex('users');
  //console.log(user);

  const organisation = await knex('organisations');
  //console.log(organisation);

  var capteurs = await knex('capteurs');
  //console.log(capteurs);


  res.render('pages/dashboard', {
    capteurs: capteurs,
    user: user,
    organisation: organisation
  });
  console.log('Affichage dashboard !');
});

// authentication page
router.get('/authentication', function(req, res) {
  res.render('pages/authentication');
});


router.post('/verification', function (req, res, next) {
  if (res.statusCode == 200)
	{
    var connexion = {
			username: req.body.username,
			password: req.body.password
		};
    console.log(connexion.username);
		console.log(connexion.password);
    if(connexion.username == "admin" && connexion.password == "admin"){
      res.redirect('/');
    }
    else{
      res.redirect('pages/authentication');
    }
  }
});

router.post('/dysfonctionnement', function (req, res, next) {
  if (res.statusCode == 200)
	{
    console.log(req.body.ID);
    if(dysfonctionnement[(req.body.ID)-1]){
      dysfonctionnement[(req.body.ID)-1].compteur++;
      console.log("Nombre de dysfonctionnement du capteur: " + dysfonctionnement[(req.body.ID)-1].compteur);
    }
    else{
      console.log("Impossible de prendre en compte le dysfonctionnement du capteur: " + req.body.ID);
      console.log("Probleme de taille de variable");
    }
    res.redirect('/');
  }
});
// const {id,name} = req.body;
//     const subQuery = knex('client').select('id').where({id})
//     subQuery.then(response=>{
//     if(response.length>0){
//         subQuery.update({name})
//         .then(resp=>{
//             res.json('update done')
//         })
//         .catch(err=>{res.json(err)})
//     }
//     else{
//         res.json('update failed')
//      }
// })
// .catch(err=>{res.json(err)})
router.post('/resetAlarm', async (req, res) => {
  if (res.statusCode == 200)
	{
    const subQuery = await knex('capteurs').select().where('id', req.body.ID).update({status: 'OK'});
    console.log(await knex('capteurs').select().where('id', req.body.ID));
    // await knex('capteurs').insert
//     subQuery.then(response=>{
//     if(response.length>0){
//         subQuery.update({name})
//         .then(resp=>{
//             res.json('update done')
//         })
//         .catch(err=>{res.json(err)})
//     }
//     else{
//         res.json('update failed')
//      }
    // capteurs[(req.body.ID)-1].status = "OK";
    // console.log(req.body.ID);
    res.redirect('/');
  }
});

// router.get("/dashboard", async (req, res) => {
//   // await = attendre connection BD ?
//     const users = await knex('users');
//     console.log(users);
//     res.render("pages/dashboard", { users: users });
// });



module.exports = router;
