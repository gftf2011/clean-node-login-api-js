const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const InvalidParamError = require('../../../src/utils/errors/invalid-param-error');

const {
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_EMAIL,
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_PASSWORD,
  INVALID_FAKE_SIGN_UP_HTTP_REQUEST_WITH_NO_CPF,
  FAKE_SIGN_UP_HTTP_REQUEST_WITH_INVALID_EMAIL,
} = require('../helpers/constants');

const SutFactory = require('../helpers/factory-methods/sign-up-router-sut-factory');

describe('SignUp Router', () => {
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
});
