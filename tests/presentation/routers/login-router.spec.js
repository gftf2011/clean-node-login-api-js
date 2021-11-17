const LoginRouter = require('../../../src/presentation/routers/login-router')

const InvalidParamError = require('../../../src/utils/errors/invalid-param-error')
const MissingParamError = require('../../../src/utils/errors/missing-param-error')
const UnauthorizedUserError = require('../../../src/utils/errors/unauthorized-error')
const ServerError = require('../../../src/utils/errors/server-error')
const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb')

const AuthUseCaseSpyFactory = require('../helpers/abstract-factories/spies/auth-use-case-spy-factory')

const SutFactory = require('../helpers/factory-methods/login-router-sut-factory')

const {
  INVALID_FAKE_ACCESS_TOKEN,
  FAKE_HTTP_REQUEST,
  FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD,
  FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD,
  INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL,
  INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD,
  INVALID_FAKE_EMPTY_HTTP_REQUEST,
  AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT,
  AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT,
  AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT,
  EMAIL_VALIDATOR_THROWING_ERROR_SUT,
  AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT,
  AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT
} = require('../helpers/constants')

describe('Login Router', () => {
  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create()
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create()
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(httpRequest.body.email).toBe(emailValidatorSpy.email)
  })

  it('Should throw error if no dependency is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
  })

  it('Should return 400 if no "email" is provided', async () => {
    const { sut } = new SutFactory().create()
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no "password" is provided', async () => {
    const { sut } = new SutFactory().create()
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 when AuthUseCase does not receive email', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create(AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBeUndefined()
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 when AuthUseCase does not receive password', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create(AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = new SutFactory().create()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = new SutFactory().create()
    authUseCaseSpy.accessToken = INVALID_FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedUserError())
  })

  it('Should return 500 if no "httpRequest" is provided', async () => {
    const { sut } = new SutFactory().create()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if no "httpRequest" has no "body"', async () => {
    const { sut } = new SutFactory().create()
    const httpRequest = INVALID_FAKE_EMPTY_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AuthUseCase is not provided', async () => {
    const sut = new LoginRouter({})
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if AuthUseCase has no execute method', async () => {
    const sut = new LoginRouter({ authUseCase: {} })
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator is not provided', async () => {
    const authUseCaseSpy = new AuthUseCaseSpyFactory().create()
    const sut = new LoginRouter({
      authUseCase: authUseCaseSpy
    })
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = new AuthUseCaseSpyFactory().create()
    const sut = new LoginRouter({
      authUseCase: authUseCaseSpy,
      emailValidator: {}
    })
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut } = new SutFactory().create(EMAIL_VALIDATOR_THROWING_ERROR_SUT)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 when AuthUseCase calls crashes', async () => {
    const { sut } = new SutFactory().create(AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 when AuthUseCase throws MongoNotConnectedError', async () => {
    const { sut } = new SutFactory().create(AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new MongoNotConnectedError('Not possible to connect to MongoDB Driver'))
  })

  it('Should return 500 when AuthUseCase throws MongoServerClosedError', async () => {
    const { sut } = new SutFactory().create(AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new MongoServerClosedError('Not possible to close MongoDB Driver'))
  })
})
