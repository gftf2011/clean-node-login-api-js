// Presentation
const LogOutRouter = require('../../presentation/routers/logout-router');

// Domain
const LogOutUseCase = require('../../domain/use-cases/logout-use-case');

// Infra
const LoadUserByIdRepository = require('../../infra/repositories/load-user-by-id-repository');
const UpdateAccessTokenRepository = require('../../infra/repositories/update-access-token-repository');

// Utils
const TokenValidator = require('../../utils/validators/token-validator');

const MongoHelper = require('../../infra/helpers/mongo-helper');

module.exports = class LogoutRouterComposer {
  compose() {
    const userModel = MongoHelper.getDb().collection('users');

    const updateAccessTokenRepository = new UpdateAccessTokenRepository({
      userModel,
    });
    const loadUserByIdRepository = new LoadUserByIdRepository({
      userModel,
    });

    const tokenValidator = new TokenValidator();

    const logOutUseCase = new LogOutUseCase({
      updateAccessTokenRepository,
      loadUserByIdRepository,
    });
    const logoutRouter = new LogOutRouter({
      logOutUseCase,
      tokenValidator,
    });

    return logoutRouter;
  }
};
