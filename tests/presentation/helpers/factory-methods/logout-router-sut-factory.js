const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const LogOutRouter = require('../../../../src/presentation/routers/logout-router');
const MissingParamError = require('../../../../src/utils/errors/missing-param-error');
const ServerError = require('../../../../src/utils/errors/server-error');

const DependenciesFactory = require('../abstract-factories/logout-router-dependencies-factory');

const {
  LOGOUT_ROUTER_SUT_TOKEN_VALIDATOR_NO_TOKEN_ERROR,
  LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_NO_USER_ID_ERROR,
  LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_THROWING_SERVER_ERROR,
  LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_THROWING_MONGO_CONNECTION_ERROR,
  LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_THROWING_MONGO_CLOSE_ERROR,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === LOGOUT_ROUTER_SUT_TOKEN_VALIDATOR_NO_TOKEN_ERROR) {
      this.dependencies.tokenValidatorSpy.retrieveUserId = () => {
        throw new MissingParamError('token');
      };
    } else if (type === LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_NO_USER_ID_ERROR) {
      this.dependencies.logOutUseCaseSpy.execute = () => {
        throw new MissingParamError('userId');
      };
    } else if (
      type === LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_THROWING_SERVER_ERROR
    ) {
      this.dependencies.logOutUseCaseSpy.execute = userId => {
        this.dependencies.logOutUseCaseSpy.userId = userId;
        throw new ServerError();
      };
    } else if (
      type === LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_THROWING_MONGO_CONNECTION_ERROR
    ) {
      this.dependencies.logOutUseCaseSpy.execute = userId => {
        this.dependencies.logOutUseCaseSpy.userId = userId;
        throw new MongoNotConnectedError(
          'Not possible to connect to MongoDB Driver',
        );
      };
    } else if (
      type === LOGOUT_ROUTER_SUT_LOGOUT_USE_CASE_THROWING_MONGO_CLOSE_ERROR
    ) {
      this.dependencies.logOutUseCaseSpy.execute = userId => {
        this.dependencies.logOutUseCaseSpy.userId = userId;
        throw new MongoServerClosedError(
          'Not possible to close MongoDB Driver',
        );
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
