const EmailValidatorSpy = require('../../../../../spies/email-validator-spy');

module.exports = class EmailValidatorSpyFactory {
  create() {
    this.emailValidatorSpy = new EmailValidatorSpy();
    this.emailValidatorSpy.isEmailValid = true;
    return this.emailValidatorSpy;
  }
};
