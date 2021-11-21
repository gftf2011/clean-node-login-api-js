const EmailValidator = require('../../../../src/utils/validators/email-validator');

module.exports = class SutFactory {
  create() {
    this.sut = new EmailValidator();
    return { sut: this.sut };
  }
};
