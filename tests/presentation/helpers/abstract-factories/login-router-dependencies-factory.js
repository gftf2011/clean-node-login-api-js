const EmailValidatorSpyFactory = require('./spies/email-validator-spy-factory');
const AuthUseCaseSpyFactory = require('./spies/auth-use-case-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.emailValidatorSpy = new EmailValidatorSpyFactory().create();
    this.authUseCaseSpy = new AuthUseCaseSpyFactory().create();
    return {
      emailValidatorSpy: this.emailValidatorSpy,
      authUseCaseSpy: this.authUseCaseSpy,
    };
  }
};
