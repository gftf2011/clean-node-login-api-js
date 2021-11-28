const validator = require('validator');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const SutFactory = require('../helpers/abstract-factories/email-validator-sut-factory');

const { VALID_EMAIL, INVALID_EMAIL } = require('../helpers/constants');

jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  isEmail(email) {
    this.email = email;
    return this.isEmailValid;
  },
}));

describe('Email Validator', () => {
  it('Should call validator with correct email', () => {
    const { sut } = new SutFactory().create();
    sut.isValid(VALID_EMAIL);
    expect(validator.email).toBe(VALID_EMAIL);
  });

  it('Should return "true" if validator returns "true"', () => {
    const { sut } = new SutFactory().create();
    const isEmailValid = sut.isValid(VALID_EMAIL);
    expect(isEmailValid).toBe(true);
  });

  it('Should return "false" if validator returns "false"', () => {
    validator.isEmailValid = false;
    const { sut } = new SutFactory().create();
    const isEmailValid = sut.isValid(INVALID_EMAIL);
    expect(isEmailValid).toBe(false);
  });

  it('Should throws MissingParamError if no email is provided', () => {
    const { sut } = new SutFactory().create();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError('email'));
  });
});
