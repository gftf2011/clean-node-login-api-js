const CpfValidatorSpy = require('../../../../../spies/cpf-validator-spy');

module.exports = class CpfValidatorSpyFactory {
  create() {
    this.cpfValidatorSpy = new CpfValidatorSpy();
    this.cpfValidatorSpy.isCpfValid = true;
    return this.cpfValidatorSpy;
  }
};
