const fakerBr = require('faker-br');
const faker = require('faker');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const InvalidParamError = require('../../../src/utils/errors/invalid-param-error');
const ForbiddenUserRegistrationError = require('../../../src/utils/errors/forbidden-user-registration-error');
const ServerError = require('../../../src/utils/errors/server-error');

const SignUpRouter = require('../../../src/presentation/routers/sign-up-router');

const EmailValidatorSpyFactory = require('../helpers/abstract-factories/spies/email-validator-spy-factory');
const CpfValidatorSpyFactory = require('../helpers/abstract-factories/spies/cpf-validator-spy-factory');

const {
  SIGN_UP_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR,
  SIGN_UP_ROUTER_SUT_CPF_VALIDATOR_THROWING_ERROR,
  SIGN_UP_ROUTER_SUT_SIGN_UP_USE_CASE_THROWING_SERVER_ERROR,
} = require('../helpers/constants');

const SutFactory = require('../helpers/factory-methods/sign-up-router-sut-factory');

describe('SignUp Router', () => {
  it('Should call SignUpUseCase with correct params', async () => {
    const { sut, signUpUseCaseSpy } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    expect(signUpUseCaseSpy.email).toBe(httpRequest.body.email);
    expect(signUpUseCaseSpy.password).toBe(httpRequest.body.password);
    expect(signUpUseCaseSpy.name).toBe(httpRequest.body.name);
    expect(signUpUseCaseSpy.cpf).toBe(httpRequest.body.cpf);
  });

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    expect(httpRequest.body.email).toBe(emailValidatorSpy.email);
  });

  it('Should call CpfValidator with correct cpf', async () => {
    const { sut, cpfValidatorSpy } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    expect(httpRequest.body.cpf).toBe(cpfValidatorSpy.cpf);
  });

  it('Should return 200 if SignUpUseCase returns accessToken', async () => {
    const { sut, signUpUseCaseSpy } = new SutFactory().create();
    signUpUseCaseSpy.accessToken = faker.datatype.uuid();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toBe(signUpUseCaseSpy.accessToken);
  });

  it('Should return 400 if email is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      body: {
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if email provided is not valid', async () => {
    const fakeFirstName = faker.name.firstName();
    const fakeLastName = faker.name.lastName();
    const { sut, emailValidatorSpy } = new SutFactory().create();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = {
      body: {
        email: faker.internet.email(fakeFirstName, fakeLastName, ''),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${fakeFirstName} ${fakeLastName}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 400 if password is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 if cpf is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('cpf'));
  });

  it('Should return 400 if cpf provided is not valid', async () => {
    const { sut, cpfValidatorSpy } = new SutFactory().create();
    cpfValidatorSpy.isCpfValid = false;
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: 'xxxxxxxxxxx',
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('cpf'));
  });

  it('Should return 400 if name is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 403 if SignUpUseCase returns null accessToken', async () => {
    const { sut, signUpUseCaseSpy } = new SutFactory().create();
    signUpUseCaseSpy.accessToken = null;
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(403);
    expect(httpResponse.body).toEqual(new ForbiddenUserRegistrationError());
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

  it('Should return 500 if SignUpRouter receives no dependencies', async () => {
    const sut = new SignUpRouter();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if SignUpRouter receives empty object as dependency', async () => {
    const sut = new SignUpRouter({});
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if emailValidator has no isValid method', async () => {
    const sut = new SignUpRouter({ emailValidator: {} });
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if cpfValidator has no isValid method', async () => {
    const emailValidatorSpy = new EmailValidatorSpyFactory().create();
    const sut = new SignUpRouter({
      emailValidator: emailValidatorSpy,
      cpfValidator: {},
    });
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if signUpUseCase has no execute method', async () => {
    const emailValidatorSpy = new EmailValidatorSpyFactory().create();
    const cpfValidatorSpy = new CpfValidatorSpyFactory().create();
    const sut = new SignUpRouter({
      emailValidator: emailValidatorSpy,
      cpfValidator: cpfValidatorSpy,
      signUpUseCase: {},
    });
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut } = new SutFactory().create(
      SIGN_UP_ROUTER_SUT_EMAIL_VALIDATOR_THROWING_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if CpfValidator throws an error', async () => {
    const { sut } = new SutFactory().create(
      SIGN_UP_ROUTER_SUT_CPF_VALIDATOR_THROWING_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if SignUpUseCase throws an error', async () => {
    const { sut } = new SutFactory().create(
      SIGN_UP_ROUTER_SUT_SIGN_UP_USE_CASE_THROWING_SERVER_ERROR,
    );
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(10, true),
        cpf: fakerBr.br.cpf(),
        name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      },
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
