const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const MissingParamError = require('../../utils/errors/missing-param-error');
const ServerError = require('../../utils/errors/server-error');
const HttpResponse = require('../helpers/http-response');

module.exports = class LogOutRouter {
  constructor({ tokenValidator, logOutUseCase } = {}) {
    this.logOutUseCase = logOutUseCase;
    this.tokenValidator = tokenValidator;
  }

  async route(httpRequest) {
    try {
      const { authorization: token } = httpRequest.headers;

      if (!token) {
        return HttpResponse.noTokenProvided();
      }
      const userId = this.tokenValidator.retrieveUserId(token);
      if (!userId) {
        return HttpResponse.unauthorizedUser();
      }
      const isLoggedOut = await this.logOutUseCase.execute(userId);
      if (!isLoggedOut) {
        return HttpResponse.noUserFound();
      }
      return HttpResponse.noContentResponse();
    } catch (error) {
      if (error instanceof MissingParamError) {
        return HttpResponse.badRequest(error);
      }
      if (
        error instanceof MongoNotConnectedError ||
        error instanceof MongoServerClosedError
      ) {
        return HttpResponse.serverError(error);
      }
      return HttpResponse.serverError(new ServerError());
    }
  }
};
