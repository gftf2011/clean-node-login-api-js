const HttpResponse = require('../helpers/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    if (!httpRequest || !httpRequest.body || !this.authUseCase || !this.authUseCase.execute) {
      return HttpResponse.serverError()
    }

    const { email, password } = httpRequest.body

    if (!email) {
      return HttpResponse.badRequest('email')
    } else if (!password) {
      return HttpResponse.badRequest('password')
    }

    // accessToken is temporary, it might be replaced by an object of existent User in the database
    const accessToken = await this.authUseCase.execute(email, password)
    if (!accessToken) {
      return HttpResponse.unauthorized()
    }
    return HttpResponse.success({ accessToken })
  }
}
