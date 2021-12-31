jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  isEmail(email) {
    this.email = email;
    return this.isEmailValid;
  },
}));

const validator = require('validator');
const faker = require('faker');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const SutFactory = require('../helpers/abstract-factories/email-validator-sut-factory');

describe('Email Validator', () => {
  it('Should call validator with correct email', () => {
    const fakeEmail = faker.internet.email();
    const { sut } = new SutFactory().create();
    sut.isValid(fakeEmail);
    expect(validator.email).toBe(fakeEmail);
  });

  it('Should return "true" if validator returns "true"', () => {
    const fakeEmail = faker.internet.email();
    const { sut } = new SutFactory().create();
    const isEmailValid = sut.isValid(fakeEmail);
    expect(isEmailValid).toBe(true);
  });

  it('Should return "false" if validator returns "false"', () => {
    const fakeEmail = faker.internet.email(
      faker.name.firstName(),
      faker.name.lastName(),
      '',
    );
    validator.isEmailValid = false;
    const { sut } = new SutFactory().create();
    const isEmailValid = sut.isValid(fakeEmail);
    expect(isEmailValid).toBe(false);
  });

  it('Should throws MissingParamError if no email is provided', () => {
    const { sut } = new SutFactory().create();
    expect(() => {
      sut.isValid();
    }).toThrow(new MissingParamError('email'));
  });
});
