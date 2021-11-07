const LoginRouter = require('./login-router')

const MissingParamError = require('../errors/missing-param-error')
const UnauthorizedUserError = require('../errors/unauthorized-error')
const ServerError = require('../errors/server-error')

const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

const makeSut = () => {
  class AuthUseCaseSpy {
    execute (email, password) {
      this.email = email
      this.password = password
    }
  }

  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    authUseCaseSpy,
    sut
  }
}

describe('Login Router', () => {
  it('Should return 400 if no "email" is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: FAKE_GENERIC_PASSWORD
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no "password" is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: FAKE_GENERIC_EMAIL
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if no "httpRequest" is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if no "httpRequest" has no "body"', () => {
    const { sut } = makeSut()
    const httpRequest = {}
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AuthUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: FAKE_GENERIC_EMAIL,
        password: FAKE_GENERIC_PASSWORD
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 401 when invalid credentials are provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: INVALID_FAKE_GENERIC_EMAIL,
        password: INVALID_FAKE_GENERIC_PASSWORD
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedUserError())
  })

  it('Should return 500 if AuthUseCase is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: FAKE_GENERIC_EMAIL,
        password: FAKE_GENERIC_PASSWORD
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AuthUseCase has no execute method', () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: FAKE_GENERIC_EMAIL,
        password: FAKE_GENERIC_PASSWORD
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
