const jwt = require('jsonwebtoken');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const ServerError = require('../../../src/utils/errors/server-error');

const TokenGenerator = require('../../../src/utils/generators/token-generator');

const SutFactory = require('../helpers/abstract-factories/token-generator-sut-factory');

const { FAKE_GENERIC_ID, FAKE_GENERIC_TOKEN } = require('../helpers/constants');

describe('Token Generator', () => {
  it('Should call JWT with correct values', async () => {
    const { sut } = new SutFactory().create();
    await sut.generate(FAKE_GENERIC_ID);
    expect(jwt.payload).toEqual({ _id: FAKE_GENERIC_ID });
    expect(jwt.secret).toBe(sut.secret);
  });

  it('Should return "null" if JWT returns "null"', async () => {
    const { sut } = new SutFactory().create();
    const token = await sut.generate(FAKE_GENERIC_ID);
    expect(token).toBeNull();
  });

  it('Should return a token if JWT returns a token', async () => {
    jwt.token = FAKE_GENERIC_TOKEN;
    const { sut } = new SutFactory().create();
    const token = await sut.generate(FAKE_GENERIC_ID);
    expect(token).toBe(FAKE_GENERIC_TOKEN);
  });

  it('Should throw ServerError if no dependency is provided', async () => {
    const sut = new TokenGenerator();
    const promise = sut.generate(FAKE_GENERIC_ID);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if no secret is provided', async () => {
    const sut = new TokenGenerator({});
    const promise = sut.generate(FAKE_GENERIC_ID);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw MissingParamError if no id is provided', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.generate();
    await expect(promise).rejects.toThrow(new MissingParamError('id'));
  });
});
