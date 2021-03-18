const { wrap } = require('async-middleware');
const loadPage = require('./commands/load-page');

module.exports = router => {
  // router.post('/data', wrap(verifyRequestBody), wrap(login), wrap(redirectToDashboard));
  // router.get('/data', wrap(loadPage));

  return router;
};