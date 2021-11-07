const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest('email')
    } else if (!password) {
      return HttpResponse.badRequest('password')
    }

    this.authUseCase.execute(email, password)

    return HttpResponse.unauthorized()
  }
}
