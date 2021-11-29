const bcrypt = require('bcrypt');

const MissingParamError = require('../../src/utils/errors/missing-param-error');

const SutFactory = require('./helpers/abstract-factories/encrypter-sut-factory');

jest.mock('bcrypt', () => ({
  isValid: true,
  async compare(value, hashValue) {
    this.value = value;
    this.hashValue = hashValue;
    return this.isValid;
  },
  async hash(value, salt) {
    this.value = value;
    this.salt = salt;
    return this.hashValue;
  },
}));

const {
  SALT_ROUNDS,
  FAKE_GENERIC_PASSWORD,
  FAKE_HASHED_PASSWORD,
  FAKE_WRONG_HASHED_PASSWORD,
} = require('./helpers/constants');

describe('Encrypter', () => {
  it('Should call bcrypt compare method with correct values', async () => {
    const { sut } = new SutFactory().create();
    await sut.compare(FAKE_GENERIC_PASSWORD, FAKE_HASHED_PASSWORD);
    expect(bcrypt.value).toBe(FAKE_GENERIC_PASSWORD);
    expect(bcrypt.hashValue).toBe(FAKE_HASHED_PASSWORD);
  });

  it('Should call bcrypt hash method with correct values', async () => {
    const { sut } = new SutFactory().create();
    bcrypt.hashValue = FAKE_HASHED_PASSWORD;
    await sut.hash(FAKE_GENERIC_PASSWORD);
    expect(bcrypt.value).toBe(FAKE_GENERIC_PASSWORD);
    expect(bcrypt.salt).toBe(SALT_ROUNDS);
    expect(bcrypt.hashValue).toBe(FAKE_HASHED_PASSWORD);
  });

  it('Should return "true" if bcrypt compare method returns "true"', async () => {
    const { sut } = new SutFactory().create();
    const isValid = await sut.compare(
      FAKE_GENERIC_PASSWORD,
      FAKE_HASHED_PASSWORD,
    );
    expect(isValid).toBe(true);
  });

  it('Should return "false" if bcrypt compare method returns "false"', async () => {
    bcrypt.isValid = false;
    const { sut } = new SutFactory().create();
    const isValid = await sut.compare(
      FAKE_GENERIC_PASSWORD,
      FAKE_WRONG_HASHED_PASSWORD,
    );
    expect(isValid).toBe(false);
  });

  it('Should return hashedPassword if bcrypt hash method returns hashedPassword', async () => {
    bcrypt.hashValue = FAKE_HASHED_PASSWORD;
    const { sut } = new SutFactory().create();
    const hashedPasword = await sut.hash(FAKE_GENERIC_PASSWORD);
    expect(hashedPasword).toBe(FAKE_HASHED_PASSWORD);
  });

  it('Should throw MissingParamError if no value is provided in compare method', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.compare();
    await expect(promise).rejects.toThrow(new MissingParamError('value'));
  });

  it('Should throw MissingParamError if no hashValue is provided in compare method', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.compare(FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new MissingParamError('hashValue'));
  });

  it('Should throw MissingParamError if no value is provided in hash method', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.hash();
    await expect(promise).rejects.toThrow(new MissingParamError('value'));
  });
});
