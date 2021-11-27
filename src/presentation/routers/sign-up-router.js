const HttpResponse = require('../helpers/http-response');

const MissingParamError = require('../../utils/errors/missing-param-error');
const InvalidParamError = require('../../utils/errors/invalid-param-error');

module.exports = class SignUpRouter {
  constructor({ emailValidator } = {}) {
    this.emailValidator = emailValidator;
  }

  // eslint-disable-next-line consistent-return
  async route(httpRequest) {
    const { email, password } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'));
    }
    if (!this.emailValidator.isValid(email)) {
      return HttpResponse.badRequest(new InvalidParamError('email'));
    }
    if (!password) {
      return HttpResponse.badRequest(new MissingParamError('password'));
    }
  }
};
