const { cpf: cpfValidator } = require('cpf-cnpj-validator');

const MissingParamError = require('../errors/missing-param-error');

module.exports = class CpfValidator {
  isValid(cpf) {
    if (!cpf) {
      throw new MissingParamError('cpf');
    }
    return cpfValidator.isValid(cpf);
  }
};
