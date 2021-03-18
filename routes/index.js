const express = require('express');

const router = express.Router();

const knex = require('../data/db');


// /* GET home page. */
router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get("/dashboard", async (req, res) => {
    const users = await knex('users');
    res.render("pages/dashboard", { users: users });
});



module.exports = router;
