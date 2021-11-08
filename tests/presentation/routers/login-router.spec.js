const LoginRouter = require('../../../src/presentation/routers/login-router')

const MissingParamError = require('../../../src/presentation/errors/missing-param-error')
const UnauthorizedUserError = require('../../../src/presentation/errors/unauthorized-error')
const ServerError = require('../../../src/presentation/errors/server-error')

const AuthUseCaseSpy = require('../helpers/auth-use-case-spy')

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
  const authUseCaseSpy = new AuthUseCaseSpy()
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    authUseCaseSpy,
    sut
  }
}

const makeSutWithError = () => {
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.execute = (_email, _password) => {
    throw new Error()
  }
  const sut = new LoginRouter(authUseCaseSpy)

  return {
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
    const { sut } = makeSut()
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
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = INVALID_FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedUserError())
  })

  it('Should return 500 if AuthUseCase is provided', async () => {
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
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
  })

  it('Should return 500 when AuthUseCase call crashes', async () => {
    const { sut, authUseCaseSpy } = makeSutWithError()
    authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
