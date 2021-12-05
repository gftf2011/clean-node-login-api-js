const { cpf: cpfValidator } = require('cpf-cnpj-validator');
const faker = require('faker-br');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const SutFactory = require('../helpers/abstract-factories/cpf-validator-sut-factory');

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
    const fakeCpf = faker.br.cpf();
    const { sut } = new SutFactory().create();
    sut.isValid(fakeCpf);
    expect(cpfValidator.cpf).toBe(fakeCpf);
  });

  it('Should return "true" if validator returns "true"', () => {
    const fakeCpf = faker.br.cpf();
    const { sut } = new SutFactory().create();
    const isCpfValid = sut.isValid(fakeCpf);
    expect(isCpfValid).toBe(true);
  });

  it('Should return "false" if validator returns "false"', () => {
    cpfValidator.isCpfValid = false;
    const fakeCpf = faker.br.cpf();
    const { sut } = new SutFactory().create();
    const isCpfValid = sut.isValid(fakeCpf);
    expect(isCpfValid).toBe(false);
  });

  it('Should throws MissingParamError if no cpf is provided', () => {
    const { sut } = new SutFactory().create();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError('cpf'));
  });
});
