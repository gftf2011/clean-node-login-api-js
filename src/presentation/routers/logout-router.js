const HttpResponse = require('../helpers/http-response');

module.exports = class LogOutRouter {
  constructor({ tokenValidator } = {}) {
    this.tokenValidator = tokenValidator;
  }

  // eslint-disable-next-line consistent-return
  async route(httpRequest) {
    const { authorization: token } = httpRequest.headers;

    if (!token) {
      return HttpResponse.noTokenProvided();
    }
    const userId = await this.tokenValidator.retriveUserId(token);
    if (!userId) {
      return HttpResponse.unauthorizedUser();
    }
  }
};
