const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const LoginRouter = require('../../../../src/presentation/routers/login-router');

const MissingParamError = require('../../../../src/utils/errors/missing-param-error');
const ServerError = require('../../../../src/utils/errors/server-error');

const DependenciesFactory = require('../abstract-factories/login-router-dependencies-factory');

const {
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_EMAIL_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_SERVER_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR,
  LOGIN_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR) {
      this.dependencies.authUseCaseSpy.execute = email => {
        this.dependencies.authUseCaseSpy.email = email;
        throw new MissingParamError('password');
      };
    } else if (type === LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_EMAIL_ERROR) {
      this.dependencies.authUseCaseSpy.execute = () => {
        throw new MissingParamError('email');
      };
    } else if (type === LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_SERVER_ERROR) {
      this.dependencies.authUseCaseSpy.execute = () => {
        throw new ServerError();
      };
    } else if (type === LOGIN_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR) {
      this.dependencies.emailValidatorSpy.isValid = _email => {
        throw new ServerError();
      };
    } else if (
      type === LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR
    ) {
      this.dependencies.authUseCaseSpy.execute = () => {
        throw new MongoNotConnectedError(
          'Not possible to connect to MongoDB Driver',
        );
      };
    } else if (
      type === LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR
    ) {
      this.dependencies.authUseCaseSpy.execute = () => {
        throw new MongoServerClosedError(
          'Not possible to close MongoDB Driver',
        );
      };
    }

    this.sut = new LoginRouter({
      authUseCase: this.dependencies.authUseCaseSpy,
      emailValidator: this.dependencies.emailValidatorSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
