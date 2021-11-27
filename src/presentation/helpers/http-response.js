const UnauthorizedUserError = require('../../utils/errors/unauthorized-user-error');
const ForbiddenUserRegistrationError = require('../../utils/errors/forbidden-user-registration-error');

module.exports = class HttpResponse {
  static success(data) {
    return {
      statusCode: 200,
      body: data,
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

  static forbiddenUserRegistrationError() {
    return {
      statusCode: 403,
      body: new ForbiddenUserRegistrationError(),
    };
  }

  static serverError(error) {
    return {
      statusCode: 500,
      body: error,
    };
  }
};
