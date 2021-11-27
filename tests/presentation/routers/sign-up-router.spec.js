const SignUpRouter = require('../../../src/presentation/routers/sign-up-router');

const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const FAKE_GENERIC_PASSWORD = 'any_password';
const INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL = {
  body: {
    password: FAKE_GENERIC_PASSWORD,
  },
};

class SutFactory {
  create() {
    this.sut = new SignUpRouter();
    return { sut: this.sut };
  }
}

describe('SignUp Router', () => {
  it('Should return 400 if email is not provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL;
    await sut.route(httpRequest);
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
});
