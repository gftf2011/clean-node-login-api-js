const UnauthorizedUserError = require('../../utils/errors/unauthorized-user-error');
const ForbiddenUserRegistrationError = require('../../utils/errors/forbidden-user-registration-error');
const NoTokenProvidedError = require('../../utils/errors/no-token-provided-error');
const NoUserFoundError = require('../../utils/errors/no-user-found-error');

module.exports = class HttpResponse {
  static success(data) {
    return {
      statusCode: 200,
      body: data,
    };
  }

  static noContentResponse() {
    return {
      statusCode: 204,
      body: null,
    };
  }

  static badRequest(error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  static unauthorizedUser() {
    return {
      statusCode: 401,
      body: new UnauthorizedUserError(),
    };
  }

  static noTokenProvided() {
    return {
      statusCode: 401,
      body: new NoTokenProvidedError(),
    };
  }

  static forbiddenUserRegistrationError() {
    return {
      statusCode: 403,
      body: new ForbiddenUserRegistrationError(),
    };
  }

  static noUserFound() {
    return {
      statusCode: 404,
      body: new NoUserFoundError(),
    };
  }

  static serverError(error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};
