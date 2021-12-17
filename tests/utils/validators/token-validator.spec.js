const faker = require('faker');

const jwt = require('jsonwebtoken');

const SutFactory = require('../helpers/abstract-factories/token-validator-sut-factory');

jest.mock('jsonwebtoken', () => ({
  verify(token, secret) {
    this.token = token;
    this.secret = secret;
    return this.decodedId;
  },
}));

describe('Token Validator', () => {
  it('Should call validator with correct token and secret', () => {
    process.env.TOKEN_SECRET = faker.datatype.uuid();
    jwt.decodedId = { _id: faker.datatype.uuid() };
    const fakeToken = faker.datatype.uuid();
    const fakeAuth = `Bearer ${fakeToken}`;
    const { sut } = new SutFactory().create();
    sut.retrieveUserId(fakeAuth);
    expect(jwt.token).toBe(fakeToken);
    expect(jwt.secret).toBe(process.env.TOKEN_SECRET);
  });

  it('Should return "id" if valid token and secret are provided', () => {
    jwt.decodedId = { _id: faker.datatype.uuid() };
    const fakeAuth = `Bearer ${faker.datatype.uuid()}`;
    const { sut } = new SutFactory().create();
    const id = sut.retrieveUserId(fakeAuth);
    expect(id).toBe(jwt.decodedId._id);
  });

  it('Should return null if jwt verify throws error', () => {
    jest.spyOn(jwt, 'verify').mockImplementationOnce((_token, _secret) => {
      throw new Error();
    });
    const fakeAuth = `Bearer ${faker.datatype.uuid()}`;
    const { sut } = new SutFactory().create();
    const id = sut.retrieveUserId(fakeAuth);
    expect(id).toBeNull();
  });
});
