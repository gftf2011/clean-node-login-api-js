const TokenValidator = require('../../../../src/utils/validators/token-validator');

module.exports = class SutFactory {
  create() {
    this.sut = new TokenValidator();

    return {
      sut: this.sut,
    };
  }
};
