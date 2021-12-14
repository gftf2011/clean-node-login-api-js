const LogOutRouter = require('../../../../src/presentation/routers/logout-router');
const MissingParamError = require('../../../../src/utils/errors/missing-param-error');

const DependenciesFactory = require('../abstract-factories/logout-router-dependencies-factory');

const {
  LOGOUT_ROUTER_SUT_TOKEN_VALIDATOR_NO_TOKEN_ERROR,
  LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_NO_USER_ID_ERROR,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === LOGOUT_ROUTER_SUT_TOKEN_VALIDATOR_NO_TOKEN_ERROR) {
      this.dependencies.tokenValidatorSpy.retrieveUserId = async token => {
        this.dependencies.tokenValidatorSpy.token = token;
        throw new MissingParamError('token');
      };
    } else if (type === LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_NO_USER_ID_ERROR) {
      this.dependencies.logOutUseCaseSpy.execute = async userId => {
        this.dependencies.logOutUseCaseSpy.userId = userId;
        throw new MissingParamError('userId');
      };
    }

    this.sut = new LogOutRouter({
      tokenValidator: this.dependencies.tokenValidatorSpy,
      logOutUseCase: this.dependencies.logOutUseCaseSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
