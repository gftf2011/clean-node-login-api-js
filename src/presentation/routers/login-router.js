const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const HttpResponse = require('../helpers/http-response');

const MissingParamError = require('../../utils/errors/missing-param-error');
const InvalidParamError = require('../../utils/errors/invalid-param-error');
const ServerError = require('../../utils/errors/server-error');

module.exports = class LoginRouter {
  constructor({ authUseCase, emailValidator } = {}) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator;
  }

  async route(httpRequest) {
    try {
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

      // accessToken is temporary, will be replaced by an object of existent User in the database
      const accessToken = await this.authUseCase.execute(email, password);
      if (!accessToken) {
        return HttpResponse.unauthorizedUser();
      }
      return HttpResponse.success({ accessToken });
    } catch (error) {
      if (
        error instanceof MissingParamError ||
        error instanceof InvalidParamError
      ) {
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
