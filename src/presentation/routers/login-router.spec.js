const LoginRouter = require('./login-router')

const MissingParamError = require('../errors/missing-param-error')
const UnauthorizedUserError = require('../errors/unauthorized-error')
const ServerError = require('../errors/server-error')

const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_GENERIC_EMAIL = 'test@gmail.com'

describe('Login Router', () => {
  it('Should return 400 if no "email" is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: FAKE_GENERIC_PASSWORD
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 401 if no "password" is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: FAKE_GENERIC_EMAIL
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedUserError())
  })

  it('Should return 500 if no "httpRequest" is provided', () => {
    const sut = new LoginRouter()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if no "httpRequest" has no "body"', () => {
    const sut = new LoginRouter()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
