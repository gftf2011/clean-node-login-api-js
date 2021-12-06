const ServerError = require('../../../../src/utils/errors/server-error');

const SignUpRouter = require('../../../../src/presentation/routers/sign-up-router');

const DependenciesFactory = require('../abstract-factories/sign-up-router-dependencies-factory');

const {
  SIGN_UP_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR,
  SIGN_UP_ROUTER_SUT_CPF_VALIDATOR_THROWING_ERROR,
  SIGN_UP_ROUTER_SUT_SIGN_UP_USE_CASE_THROWING_SERVER_ERROR,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === SIGN_UP_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR) {
      this.dependencies.emailValidatorSpy.isValid = _email => {
        throw new ServerError();
      };
    }
    if (type === SIGN_UP_ROUTER_SUT_CPF_VALIDATOR_THROWING_ERROR) {
      this.dependencies.cpfValidatorSpy.isValid = _email => {
        throw new ServerError();
      };
    }
    if (type === SIGN_UP_ROUTER_SUT_SIGN_UP_USE_CASE_THROWING_SERVER_ERROR) {
      this.dependencies.signUpUseCaseSpy.execute = () => {
        throw new ServerError();
      };
    }
    this.sut = new SignUpRouter({
      emailValidator: this.dependencies.emailValidatorSpy,
      cpfValidator: this.dependencies.cpfValidatorSpy,
      signUpUseCase: this.dependencies.signUpUseCaseSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
