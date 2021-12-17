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
  it('Should return "id" if valid token and secret are provided', async () => {
    jwt.decodedId = { _id: faker.datatype.uuid() };
    const fakeAuth = `Bearer ${faker.datatype.uuid()}`;
    const { sut } = new SutFactory().create();
    const id = await sut.retrieveUserId(fakeAuth);
    expect(id).toBe(jwt.decodedId._id);
  });
});
