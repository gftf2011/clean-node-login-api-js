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

const bcrypt = require('bcrypt');
const faker = require('faker');

const MissingParamError = require('../../src/utils/errors/missing-param-error');

const SutFactory = require('./helpers/abstract-factories/encrypter-sut-factory');

describe('Encrypter', () => {
  it('Should call bcrypt compare method with correct values', async () => {
    const fakePassword = faker.internet.password(10, true);
    const fakeHashPassword = faker.internet.password(64, false);
    const { sut } = new SutFactory().create();
    await sut.compare(fakePassword, fakeHashPassword);
    expect(bcrypt.value).toBe(fakePassword);
    expect(bcrypt.hashValue).toBe(fakeHashPassword);
  });

  it('Should call bcrypt hash method with correct values', async () => {
    const fakePassword = faker.internet.password(10, true);
    const fakeHashPassword = faker.internet.password(64, false);
    const { sut } = new SutFactory().create();
    bcrypt.hashValue = fakeHashPassword;
    await sut.hash(fakePassword);
    expect(bcrypt.value).toBe(fakePassword);
    expect(bcrypt.salt).toBe(12);
    expect(bcrypt.hashValue).toBe(fakeHashPassword);
  });

  it('Should return "true" if bcrypt compare method returns "true"', async () => {
    const fakePassword = faker.internet.password(10, true);
    const fakeHashPassword = faker.internet.password(64, false);
    const { sut } = new SutFactory().create();
    const isValid = await sut.compare(fakePassword, fakeHashPassword);
    expect(isValid).toBe(true);
  });

  it('Should return "false" if bcrypt compare method returns "false"', async () => {
    bcrypt.isValid = false;
    const fakePassword = faker.internet.password(10, true);
    const fakeHashPassword = faker.internet.password(64, false);
    const { sut } = new SutFactory().create();
    const isValid = await sut.compare(fakePassword, fakeHashPassword);
    expect(isValid).toBe(false);
  });

  it('Should return hashedPassword if bcrypt hash method returns hashedPassword', async () => {
    const fakePassword = faker.internet.password(10, true);
    const fakeHashPassword = faker.internet.password(64, false);
    bcrypt.hashValue = fakeHashPassword;
    const { sut } = new SutFactory().create();
    const hashedPasword = await sut.hash(fakePassword);
    expect(hashedPasword).toBe(fakeHashPassword);
  });

  it('Should throw MissingParamError if no value is provided in compare method', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.compare();
    await expect(promise).rejects.toThrow(new MissingParamError('value'));
  });

  it('Should throw MissingParamError if no hashValue is provided in compare method', async () => {
    const fakePassword = faker.internet.password(10, true);
    const { sut } = new SutFactory().create();
    const promise = sut.compare(fakePassword);
    await expect(promise).rejects.toThrow(new MissingParamError('hashValue'));
  });

  it('Should throw MissingParamError if no value is provided in hash method', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.hash();
    await expect(promise).rejects.toThrow(new MissingParamError('value'));
  });
});
