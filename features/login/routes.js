const { wrap } = require('async-middleware');

const login = require('./commands/login');
const loadPage = require('./commands/load-page');

module.exports = router => {
  router.post('/login', wrap(login));
  router.get('/login', wrap(loadPage));

  return router;
};
