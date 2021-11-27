const EmailValidatorSpyFactory = require('./spies/email-validator-spy-factory');
const CpfValidatorSpyFactory = require('./spies/cpf-validator-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.emailValidatorSpy = new EmailValidatorSpyFactory().create();
    this.cpfValidatorSpy = new CpfValidatorSpyFactory().create();
    return {
      emailValidatorSpy: this.emailValidatorSpy,
      cpfValidatorSpy: this.cpfValidatorSpy,
    };
  }
};
