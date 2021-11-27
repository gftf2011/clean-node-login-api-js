const HttpResponse = require('../helpers/http-response');

const MissingParamError = require('../../utils/errors/missing-param-error');

module.exports = class SignUpRouter {
  // eslint-disable-next-line consistent-return
  async route(httpRequest) {
    const { email } = httpRequest.body;
    if (!email) {
      return HttpResponse.badRequest(new MissingParamError('email'));
    }
  }
};
