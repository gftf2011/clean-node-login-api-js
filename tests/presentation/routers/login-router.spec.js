const LoginRouter = require('../../../src/presentation/routers/login-router')

const InvalidParamError = require('../../../src/presentation/errors/invalid-param-error')
const MissingParamError = require('../../../src/presentation/errors/missing-param-error')
const UnauthorizedUserError = require('../../../src/presentation/errors/unauthorized-error')
const ServerError = require('../../../src/presentation/errors/server-error')

const AuthUseCaseSpy = require('../helpers/auth-use-case-spy')
const EmailValidatorSpy = require('../helpers/email-validator-spy')

const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_ACCESS_TOKEN = 'access_token'
const INVALID_FAKE_ACCESS_TOKEN = null
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

const FAKE_HTTP_REQUEST = {
  body: {
    email: FAKE_GENERIC_EMAIL,
    password: FAKE_GENERIC_PASSWORD
  }
}
const FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD = {
  body: {
    email: INVALID_FAKE_GENERIC_EMAIL,
    password: FAKE_GENERIC_PASSWORD
  }
}
const FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD = {
  body: {
    email: INVALID_FAKE_GENERIC_EMAIL,
    password: INVALID_FAKE_GENERIC_PASSWORD
  }
}
const INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL = {
  body: {
    password: FAKE_GENERIC_PASSWORD
  }
}
const INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD = {
  body: {
    email: FAKE_GENERIC_EMAIL
  }
}
const INVALID_FAKE_EMPTY_HTTP_REQUEST = {}

const makeSut = () => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

const makeSutWithAuthUseCaseThrowingError = () => {
  const emailValidatorSpy = new EmailValidatorSpy()
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.execute = async (_email, _password) => {
    throw new Error()
  }
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

const makeSutWithEmailValidatorThrowingError = () => {
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isValid = (_email) => {
    throw new ServerError()
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

describe('Login Router', () => {
  it('Should return 400 if no "email" is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no "password" is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = true
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if no "httpRequest" is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if no "httpRequest" has no "body"', async () => {
    const { sut } = makeSut()
    const httpRequest = INVALID_FAKE_EMPTY_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = true
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = true
    authUseCaseSpy.accessToken = INVALID_FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedUserError())
  })

  it('Should return 500 if AuthUseCase is not provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AuthUseCase has no execute method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = true
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
  })

  it('Should return 500 when AuthUseCase call crashes', async () => {
    const { sut, authUseCaseSpy, emailValidatorSpy } = makeSutWithAuthUseCaseThrowingError()
    emailValidatorSpy.isEmailValid = true
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, authUseCaseSpy, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if EmailValidator is not provided', async () => {
    const authUseCaseSpy = new AuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy)
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator has no isVallid method', async () => {
    const authUseCaseSpy = new AuthUseCaseSpy()
    const sut = new LoginRouter(authUseCaseSpy, {})
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut, authUseCaseSpy } = makeSutWithEmailValidatorThrowingError()
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, authUseCaseSpy, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = true
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(httpRequest.body.email).toBe(emailValidatorSpy.email)
  })
})
