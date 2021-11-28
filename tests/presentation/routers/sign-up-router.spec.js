const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const InvalidParamError = require('../../../src/utils/errors/invalid-param-error');
const ForbiddenUserRegistrationError = require('../../../src/utils/errors/forbidden-user-registration-error');
const ServerError = require('../../../src/utils/errors/server-error');

const SignUpRouter = require('../../../src/presentation/routers/sign-up-router');

const EmailValidatorSpyFactory = require('../helpers/abstract-factories/spies/email-validator-spy-factory');
const CpfValidatorSpyFactory = require('../helpers/abstract-factories/spies/cpf-validator-spy-factory');

const {
  CPF_VALIDATOR_THROWING_ERROR_SUT,
  EMAIL_VALIDATOR_THROWING_ERROR_SUT,
  FAKE_HTTP_REQUEST_WITH_EMAIL_ALREADY_INSERTED,
  INVALID_FAKE_ACCESS_TOKEN,
  INVALID_FAKE_EMPTY_HTTP_REQUEST,
  FAKE_SIGN_UP_HTTP_REQUEST,
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_EMAIL,
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_PASSWORD,
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_CPF,
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_NAME,
  FAKE_SIGN_UP_HTTP_REQUEST_WITH_INVALID_EMAIL,
  FAKE_SIGN_UP_HTTP_REQUEST_WITH_INVALID_CPF,
} = require('../helpers/constants');

const SutFactory = require('../helpers/factory-methods/sign-up-router-sut-factory');

describe('SignUp Router', () => {
  it('Should return 200 if SignUpUseCase returns accessToken', async () => {
    const { sut, signUpUseCaseSpy } = new SutFactory().create();
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body.accessToken).toBe(signUpUseCaseSpy.accessToken);
  });

  it('Should return 400 if email is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_EMAIL;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if email provided is not valid', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST_WITH_INVALID_EMAIL;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 400 if password is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_PASSWORD;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('Should return 400 if cpf is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_CPF;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('cpf'));
  });

  it('Should return 400 if cpf provided is not valid', async () => {
    const { sut, cpfValidatorSpy } = new SutFactory().create();
    cpfValidatorSpy.isCpfValid = false;
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST_WITH_INVALID_CPF;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('cpf'));
  });

  it('Should return 400 if name is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_NAME;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('Should return 403 if SignUpUseCase returns null accessToken', async () => {
    const { sut, signUpUseCaseSpy } = new SutFactory().create();
    signUpUseCaseSpy.accessToken = INVALID_FAKE_ACCESS_TOKEN;
    const httpRequest = FAKE_HTTP_REQUEST_WITH_EMAIL_ALREADY_INSERTED;
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
    const httpRequest = INVALID_FAKE_EMPTY_HTTP_REQUEST;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if SignUpRouter receives no dependencies', async () => {
    const sut = new SignUpRouter();
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if SignUpRouter receives empty object as dependency', async () => {
    const sut = new SignUpRouter({});
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if emailValidator has no isValid method', async () => {
    const sut = new SignUpRouter({ emailValidator: {} });
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
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
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
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
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut } = new SutFactory().create(EMAIL_VALIDATOR_THROWING_ERROR_SUT);
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  it('Should return 500 if CpfValidator throws an error', async () => {
    const { sut } = new SutFactory().create(CPF_VALIDATOR_THROWING_ERROR_SUT);
    const httpRequest = FAKE_SIGN_UP_HTTP_REQUEST;
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
