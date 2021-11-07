const MissingParamError = require('../errors/missing-param-error')
const UnauthorizedUserError = require('../errors/unauthorized-error')
const ServerError = require('../errors/server-error')

module.exports = class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static unauthorized () {
    return {
      statusCode: 401,
      body: new UnauthorizedUserError()
    }
  }

  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }
}
