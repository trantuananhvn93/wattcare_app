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

// /* GET home page. */
router.get('/', isAuthenticated, (req, res) => {
  res.render('pages/index');
});

router.get("/dashboard", isAuthenticated, async (req, res) => {
  const users = await knex('users');
  res.render("pages/dashboard", { users: users });
});


mountLoginRoutes(router);
mountLogoutRoutes(router);

module.exports = router;
