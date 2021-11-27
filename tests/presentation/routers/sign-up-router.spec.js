const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const InvalidParamError = require('../../../src/utils/errors/invalid-param-error');

const {
  INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL,
  INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD,
  FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD,
} = require('../helpers/constants');

const SutFactory = require('../helpers/factory-methods/sign-up-router-sut-factory');

describe('SignUp Router', () => {
  it('Should return 400 if email is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('Should return 400 if email provided is not valid', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create();
    emailValidatorSpy.isEmailValid = false;
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('Should return 400 if password is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
});
