const faker = require('faker');

const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const LoginRouter = require('../../../src/presentation/routers/login-router');

const InvalidParamError = require('../../../src/utils/errors/invalid-param-error');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const UnauthorizedUserError = require('../../../src/utils/errors/unauthorized-user-error');
const ServerError = require('../../../src/utils/errors/server-error');

const EmailValidatorSpyFactory = require('../helpers/abstract-factories/spies/email-validator-spy-factory');

const SutFactory = require('../helpers/factory-methods/login-router-sut-factory');

const {
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_EMAIL_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_SERVER_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR,
  LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR,
  LOGIN_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR,
} = require('../helpers/constants');

describe('Login Router', () => {
  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password);
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    await sut.route(httpRequest);
    expect(httpRequest.body.email).toBe(emailValidatorSpy.email);
  });

  it('Should throw error if no dependency is provided', async () => {
    const sut = new LoginRouter();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create();
    authUseCaseSpy.accessToken = faker.datatype.uuid();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken);
  });

  it('Should return 400 if no "email" is provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      body: {
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if no "password" is provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 when AuthUseCase does not receive email', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create(
      LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_EMAIL_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBeUndefined();
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 when AuthUseCase does not receive password', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create(
      LOGIN_ROUTER_SUT_AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: faker.internet.email(
          faker.name.firstName(),
          faker.name.lastName(),
          '',
        ),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create();
    authUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: faker.internet.email(
          faker.name.firstName(),
          faker.name.lastName(),
          '',
        ),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new UnauthorizedUserError());
  });

  it('Should return 500 if no "httpRequest" is provided', async () => {
    const { sut } = new SutFactory().create();
    const httpResponse = await sut.route();
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if "httpRequest" has no "body"', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {};
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator is not provided', async () => {
    const sut = new LoginRouter({});
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator has no isValid method', async () => {
    const sut = new LoginRouter({
      emailValidator: {},
    });
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if AuthUseCase is not provided', async () => {
    const emailValidatorSpy = new EmailValidatorSpyFactory().create();
    const sut = new LoginRouter({
      emailValidator: emailValidatorSpy,
    });
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if AuthUseCase has no execute method', async () => {
    const emailValidatorSpy = new EmailValidatorSpyFactory().create();
    const sut = new LoginRouter({
      emailValidator: emailValidatorSpy,
      authUseCase: {},
    });
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut } = new SutFactory().create(
      LOGIN_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 when AuthUseCase calls crashes', async () => {
    const { sut } = new SutFactory().create(
      LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_SERVER_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 when AuthUseCase throws MongoNotConnectedError', async () => {
    const { sut } = new SutFactory().create(
      LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(
      new MongoNotConnectedError('Not possible to connect to MongoDB Driver'),
    );
  });

  it('Should return 500 when AuthUseCase throws MongoServerClosedError', async () => {
    const { sut } = new SutFactory().create(
      LOGIN_ROUTER_SUT_AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(
      new MongoServerClosedError('Not possible to close MongoDB Driver'),
    );
  });
});
