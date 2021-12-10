const SignUpRouterComposer = require('../composers/sign-up-router-composer');

const ExpressRouterAdapter = require('../adapters/express-router-adapter');

module.exports = router => {
  const signUpRouterComposer = new SignUpRouterComposer();
  const signUpRouter = signUpRouterComposer.compose();
  router.post('/sign-up', ExpressRouterAdapter.adapter(signUpRouter));
};
