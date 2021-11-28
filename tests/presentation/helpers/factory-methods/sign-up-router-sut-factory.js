const ServerError = require('../../../../src/utils/errors/server-error');

const SignUpRouter = require('../../../../src/presentation/routers/sign-up-router');

const DependenciesFactory = require('../abstract-factories/sign-up-router-dependencies-factory');

const {
  EMAIL_VALIDATOR_THROWING_ERROR_SUT,
  CPF_VALIDATOR_THROWING_ERROR_SUT,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === EMAIL_VALIDATOR_THROWING_ERROR_SUT) {
      this.dependencies.emailValidatorSpy.isValid = _email => {
        throw new ServerError();
      };
    }
    if (type === CPF_VALIDATOR_THROWING_ERROR_SUT) {
      this.dependencies.cpfValidatorSpy.isValid = _email => {
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
