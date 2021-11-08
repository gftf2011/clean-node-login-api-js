const HttpResponse = require('../helpers/http-response')

const MissingParamError = require('../errors/missing-param-error')
const InvalidParamError = require('../errors/invalid-param-error')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      } else if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      } else if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      // accessToken is temporary, it might be replaced by an object of existent User in the database
      const accessToken = await this.authUseCase.execute(email, password)
      if (!accessToken) {
        return HttpResponse.unauthorized()
      }
      return HttpResponse.success({ accessToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
