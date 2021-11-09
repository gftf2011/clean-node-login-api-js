const UnauthorizedUserError = require('../../utils/errors/unauthorized-error')
const ServerError = require('../../utils/errors/server-error')

module.exports = class HttpResponse {
  static success (data) {
    return {
      statusCode: 200,
      body: data
    }
  }

  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
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
