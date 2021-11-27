module.exports = class CpfValidatorSpy {
  isValid(cpf) {
    this.email = cpf;
    return this.isCpfValid;
  }
};
