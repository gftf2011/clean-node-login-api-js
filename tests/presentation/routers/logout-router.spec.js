const faker = require('faker');

const NoTokenProvidedError = require('../../../src/utils/errors/no-token-provided-error');
const NoUserFoundError = require('../../../src/utils/errors/no-user-found-error');
const ServerError = require('../../../src/utils/errors/server-error');
const UnauthorizedUserError = require('../../../src/utils/errors/unauthorized-user-error');

const SutFactory = require('../helpers/factory-methods/logout-router-sut-factory');

const LogOutRouter = require('../../../src/presentation/routers/logout-router');

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

  it('Should call LogOutUseCase with userId', async () => {
    const { sut, tokenValidatorSpy, logOutUseCaseSpy } =
      new SutFactory().create();
    const httpRequest = {
      headers: {
        authorization: faker.datatype.uuid(),
      },
    };
    tokenValidatorSpy.userId = faker.datatype.uuid();
    await sut.route(httpRequest);
    expect(tokenValidatorSpy.userId).toBe(logOutUseCaseSpy.userId);
  });

  it('Should return 204 when valid authorization is provided', async () => {
    const { sut, tokenValidatorSpy, logOutUseCaseSpy } =
      new SutFactory().create();
    const httpRequest = {
      headers: {
        authorization: faker.datatype.uuid(),
      },
    };
    tokenValidatorSpy.userId = faker.datatype.uuid();
    logOutUseCaseSpy.isLoggedOut = true;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(204);
    expect(httpResponse.body).toBeNull();
  });

  it('Should return 500 if no "httpRequest" is provided', async () => {
    const { sut } = new SutFactory().create();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if "httpRequest" has no headers provided', async () => {
    const { sut } = new SutFactory().create();
    const httpResponse = await sut.route({});
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if no dependency is provided', async () => {
    const sut = new LogOutRouter();
    const httpRequest = {
      headers: {
        authorization: faker.datatype.uuid(),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});