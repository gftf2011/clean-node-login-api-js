const LogoutRouterComposer = require('../composers/logout-router-composer');

const ExpressRouterAdapter = require('../adapters/express-router-adapter');

module.exports = router => {
  const logoutRouterComposer = new LogoutRouterComposer();
  const logoutRouter = logoutRouterComposer.compose();
  router.post('/logout', ExpressRouterAdapter.adapter(logoutRouter));
};
