const LoginRouterComposer = require('../composers/login-router-composer');

const ExpressRouterAdapter = require('../adapters/express-router-adapter');

module.exports = router => {
  const loginRouterComposer = new LoginRouterComposer();
  const loginRouter = loginRouterComposer.compose();
  router.post('/login', ExpressRouterAdapter.adapter(loginRouter));
};
