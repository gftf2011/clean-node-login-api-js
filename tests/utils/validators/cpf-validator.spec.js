const { cpf: cpfValidator } = require('cpf-cnpj-validator');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const SutFactory = require('../helpers/abstract-factories/cpf-validator-sut-factory');

const { VALID_CPF, INVALID_CPF } = require('../helpers/constants');

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

  it('Should return "false" if validator returns "false"', () => {
    cpfValidator.isCpfValid = false;
    const { sut } = new SutFactory().create();
    const isCpfValid = sut.isValid(INVALID_CPF);
    expect(isCpfValid).toBe(false);
  });

  it('Should throws MissingParamError if no cpf is provided', () => {
    const { sut } = new SutFactory().create();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError('cpf'));
  });
});
