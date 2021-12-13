const faker = require('faker');

const NoTokenProvidedError = require('../../../src/utils/errors/no-token-provided-error');
const NoUserFoundError = require('../../../src/utils/errors/no-user-found-error');
const UnauthorizedUserError = require('../../../src/utils/errors/unauthorized-user-error');

const SutFactory = require('../helpers/factory-methods/logout-router-sut-factory');

// Receber o bearer token - (accessToken)
// Verificar o bearer token é válido
// Pegar o id de usuário dentro do bearer token
// Verificar se o usuário existe
// Setar o accessToken como nulo a partir do ID

describe('LogOut Router', () => {
  it('Should throw error if no authorization is provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      headers: {},
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new NoTokenProvidedError());
  });

  it('Should throw error if authorization is invalid', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      headers: {
        authorization: faker.datatype.uuid(),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedUserError());
  });

  it('Should throw error if user was not found', async () => {
    const { sut, tokenValidatorSpy } = new SutFactory().create();
    const httpRequest = {
      headers: {
        authorization: faker.datatype.uuid(),
      },
    };
    tokenValidatorSpy.userId = faker.datatype.uuid();
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(404);
    expect(httpResponse.body).toEqual(new NoUserFoundError());
  });

  it('Should call TokenValidator with authorization token', async () => {
    const { sut, tokenValidatorSpy } = new SutFactory().create();
    const httpRequest = {
      headers: {
        authorization: faker.datatype.uuid(),
      },
    };
    await sut.route(httpRequest);
    expect(httpRequest.headers.authorization).toBe(tokenValidatorSpy.token);
  });
});
