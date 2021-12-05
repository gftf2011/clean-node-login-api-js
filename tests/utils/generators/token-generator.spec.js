const jwt = require('jsonwebtoken');
const faker = require('faker');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const ServerError = require('../../../src/utils/errors/server-error');

const TokenGenerator = require('../../../src/utils/generators/token-generator');

const SutFactory = require('../helpers/abstract-factories/token-generator-sut-factory');

jest.mock('jsonwebtoken', () => ({
  token: null,
  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  },
}));

describe('Token Generator', () => {
  it('Should call JWT with correct values', async () => {
    const fakeId = faker.datatype.uuid();
    const { sut } = new SutFactory().create();
    await sut.generate(fakeId);
    expect(jwt.payload).toEqual({ _id: fakeId });
    expect(jwt.secret).toBe(sut.secret);
  });

  it('Should return "null" if JWT returns "null"', async () => {
    const fakeToken = faker.datatype.uuid();
    const { sut } = new SutFactory().create();
    const token = await sut.generate(fakeToken);
    expect(token).toBeNull();
  });

  it('Should return a token if JWT returns a token', async () => {
    const fakeId = faker.datatype.uuid();
    const fakeToken = faker.datatype.uuid();
    jwt.token = fakeToken;
    const { sut } = new SutFactory().create();
    const token = await sut.generate(fakeId);
    expect(token).toBe(fakeToken);
  });

  it('Should throw ServerError if no dependency is provided', async () => {
    const fakeId = faker.datatype.uuid();
    const sut = new TokenGenerator();
    const promise = sut.generate(fakeId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if no secret is provided', async () => {
    const fakeId = faker.datatype.uuid();
    const sut = new TokenGenerator({});
    const promise = sut.generate(fakeId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw MissingParamError if no id is provided', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.generate();
    await expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
