const { cpf: cpfValidator } = require('cpf-cnpj-validator');

const SutFactory = require('../helpers/abstract-factories/cpf-validator-sut-factory');

const { VALID_CPF } = require('../helpers/constants');

jest.mock('cpf-cnpj-validator', () => ({
  cpf: {
    isCpfValid: true,
    cpf: '',
    isValid(cpf) {
      this.cpf = cpf;
      return this.isCpfValid;
    },
  },
}));

describe('CPF Validator', () => {
  it('Should call validator with correct cpf', () => {
    const { sut } = new SutFactory().create();
    sut.isValid(VALID_CPF);
    expect(cpfValidator.cpf).toBe(VALID_CPF);
  });

  it('Should return "true" if validator returns "true"', () => {
    const { sut } = new SutFactory().create();
    const isCpfValid = sut.isValid(VALID_CPF);
    expect(isCpfValid).toBe(true);
  });
});
