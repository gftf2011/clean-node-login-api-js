// Presentation
const LoginRouter = require('../../presentation/routers/login-router');

// Domain
const AuthUseCase = require('../../domain/use-cases/auth-use-case');

// Infra
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository');
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository');

const MongoHelper = require('../../infra/helpers/mongo-helper');

// Utils
const TokenGenerator = require('../../utils/generators/token-generator');
const Encrypter = require('../../utils/encrypter');
const EmailValidator = require('../../utils/validators/email-validator');

module.exports = router => {
  const userModel = MongoHelper.getDb().collection('users');

  const tokenGenerator = new TokenGenerator();
  const encrypter = new Encrypter();
  const emailValidator = new EmailValidator();

  const updateAccessTokenRepository = new UpdateAccessTokenRepository({
    userModel,
  });
  const loadUserByEmailRepository = new LoadUserByEmailRepository({
    userModel,
  });

  const authUseCase = new AuthUseCase({
    updateAccessTokenRepository,
    loadUserByEmailRepository,
    encrypter,
    tokenGenerator,
  });
  const loginRouter = new LoginRouter({
    authUseCase,
    emailValidator,
  });
  router.post('/login', (req, _res) => {
    return loginRouter.route(req);
  });
};
