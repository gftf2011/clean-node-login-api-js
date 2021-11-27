module.exports = class CpfValidatorSpy {
  isValid(cpf) {
    this.cpf = cpf;
    return this.isCpfValid;
  }
};
