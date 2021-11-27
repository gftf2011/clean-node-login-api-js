const EmailValidatorSpyFactory = require('./spies/email-validator-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.emailValidatorSpy = new EmailValidatorSpyFactory().create();
    return {
      emailValidatorSpy: this.emailValidatorSpy,
    };
  }
};
