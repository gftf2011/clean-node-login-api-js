const HttpResponse = require('../helpers/http-response');

module.exports = class LogOutRouter {
  constructor({ tokenValidator, logOutUseCase } = {}) {
    this.logOutUseCase = logOutUseCase;
    this.tokenValidator = tokenValidator;
  }

  async route(httpRequest) {
    const { authorization: token } = httpRequest.headers;

    if (!token) {
      return HttpResponse.noTokenProvided();
    }
    const userId = await this.tokenValidator.retrieveUserId(token);
    if (!userId) {
      return HttpResponse.unauthorizedUser();
    }
    const isLoggedOut = await this.logOutUseCase.execute(userId);
    if (!isLoggedOut) {
      return HttpResponse.noUserFound();
    }
    return HttpResponse.noContentResponse();
  }
};
