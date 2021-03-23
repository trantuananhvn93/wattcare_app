const { wrap } = require('async-middleware');

const { logout } = require('./commands/logout');

module.exports = router => {
  router.get('/logout', wrap(logout));
  return router;
};