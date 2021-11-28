const CpfValidator = require('../../../../src/utils/validators/cpf-validator');

module.exports = class SutFactory {
  create() {
    this.sut = new CpfValidator();
    return { sut: this.sut };
  }
};
