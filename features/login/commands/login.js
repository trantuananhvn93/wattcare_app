// const debug = require('debug')('express:login');
const passport = require('passport');

const {
  USERNAME_PASSWORD_COMBINATION_ERROR,
  INTERNAL_SERVER_ERROR,
  SUCCESSFULLY_LOGGED_IN,
} = require('../constants');

function login(req, res, next) {
  return passport.authenticate('local', (error, user) => {
    if (error || !user) {
      req.session.messages = {
        errors: { invalidEmailOrPassword: USERNAME_PASSWORD_COMBINATION_ERROR },
      };
      return res.redirect('/login');
    }

    return req.logIn(user, loginError => {
      if (loginError) {
        req.session.messages = {
          errors: { internalServerError: INTERNAL_SERVER_ERROR },
        };
        return res.redirect('/login');
      }
      req.session.messages = { loggedIn: SUCCESSFULLY_LOGGED_IN };
      return res.redirect('/');
    });
  })(req, res, next);
}

// function login(req, res, next) {
//   // debug('login');
//   return passport.authenticate('local',  {
//     failureRedirect: '/login',
//     successRedirect: '/dashboard'
//   })(req, res, next);
// }

module.exports = login;
