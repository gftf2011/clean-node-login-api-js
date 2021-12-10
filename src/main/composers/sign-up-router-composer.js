// Presentation
const SignUpRouter = require('../../presentation/routers/sign-up-router');

// Domain
const SignUpUseCase = require('../../domain/use-cases/sign-up-use-case');

// Infra
const LoadUserByEmailRepository = require('../../infra/repositories/load-user-by-email-repository');
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository');
const InsertUserRepository = require('../../infra/repositories/insert-user-repository');

const MongoHelper = require('../../infra/helpers/mongo-helper');

// Utils
const TokenGenerator = require('../../utils/generators/token-generator');
const Encrypter = require('../../utils/encrypter');
const EmailValidator = require('../../utils/validators/email-validator');
const CpfValidator = require('../../utils/validators/cpf-validator');

// ENV
const { TOKEN_SECRET } = require('../config/env');

module.exports = class SignUpRouterComposer {
  compose() {
    const userModel = MongoHelper.getDb().collection('users');

    const tokenGenerator = new TokenGenerator({ secret: TOKEN_SECRET });
    const encrypter = new Encrypter();
    const emailValidator = new EmailValidator();
    const cpfValidator = new CpfValidator();

    const updateAccessTokenRepository = new UpdateAccessTokenRepository({
      userModel,
    });
    const loadUserByEmailRepository = new LoadUserByEmailRepository({
      userModel,
    });
    const insertUserRepository = new InsertUserRepository({
      userModel,
    });

    const signUpUseCase = new SignUpUseCase({
      updateAccessTokenRepository,
      loadUserByEmailRepository,
      insertUserRepository,
      encrypter,
      tokenGenerator,
    });
    const signUpRouter = new SignUpRouter({
      signUpUseCase,
      emailValidator,
      cpfValidator,
    });

    return signUpRouter;
  }
};
