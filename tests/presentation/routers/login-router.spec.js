const LoginRouter = require('../../../src/presentation/routers/login-router')

const InvalidParamError = require('../../../src/utils/errors/invalid-param-error')
const MissingParamError = require('../../../src/utils/errors/missing-param-error')
const UnauthorizedUserError = require('../../../src/utils/errors/unauthorized-error')
const ServerError = require('../../../src/utils/errors/server-error')

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

const createEmailValidatorSpyFactory = () => {
  const emailValidatorSpy = new EmailValidatorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const createAuthUseCaseSpyFactory = () => {
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
  return authUseCaseSpy
}

const createSutFactory = () => {
  const emailValidatorSpy = createEmailValidatorSpyFactory()
  const authUseCaseSpy = createAuthUseCaseSpyFactory()
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

const createSutFactoryAuthUseCaseWithNoPasswordError = () => {
  const emailValidatorSpy = createEmailValidatorSpyFactory()
  const authUseCaseSpy = createAuthUseCaseSpyFactory()
  authUseCaseSpy.execute = async (email) => {
    authUseCaseSpy.email = email
    throw new MissingParamError('password')
  }
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

const createSutFactoryAuthUseCaseWithNoEmailError = () => {
  const emailValidatorSpy = createEmailValidatorSpyFactory()
  const authUseCaseSpy = createAuthUseCaseSpyFactory()
  authUseCaseSpy.execute = async () => {
    throw new MissingParamError('email')
  }
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

const createSutFactoryAuthUseCaseThrowingServerError = () => {
  const emailValidatorSpy = createEmailValidatorSpyFactory()
  const authUseCaseSpy = createAuthUseCaseSpyFactory()
  authUseCaseSpy.execute = async () => {
    throw new ServerError()
  }
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

const createSutFactoryWithEmailValidatorThrowingError = () => {
  const emailValidatorSpy = createEmailValidatorSpyFactory()
  emailValidatorSpy.isValid = (_email) => {
    throw new ServerError()
  }
  const authUseCaseSpy = createAuthUseCaseSpyFactory()
  const sut = new LoginRouter({
    authUseCase: authUseCaseSpy,
    emailValidator: emailValidatorSpy
  })

  return {
    emailValidatorSpy,
    authUseCaseSpy,
    sut
  }
}

describe('Login Router', () => {
  it('Should return 400 if no "email" is provided', async () => {
    const { sut } = createSutFactory()
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no "password" is provided', async () => {
    const { sut } = createSutFactory()
    const httpRequest = INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 if no "httpRequest" is provided', async () => {
    const { sut } = createSutFactory()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if no "httpRequest" has no "body"', async () => {
    const { sut } = createSutFactory()
    const httpRequest = INVALID_FAKE_EMPTY_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AuthUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = createSutFactory()
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = createSutFactory()
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
    const { sut, authUseCaseSpy } = createSutFactory()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.accessToken).toBe(authUseCaseSpy.accessToken)
  })

  it('Should return 400 when AuthUseCase does not receive email', async () => {
    const { sut, authUseCaseSpy } = createSutFactoryAuthUseCaseWithNoEmailError()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBeUndefined()
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 when AuthUseCase does not receive password', async () => {
    const { sut, authUseCaseSpy } = createSutFactoryAuthUseCaseWithNoPasswordError()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 500 when AuthUseCase calls crashes', async () => {
    const { sut } = createSutFactoryAuthUseCaseThrowingServerError()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = createSutFactory()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if EmailValidator is not provided', async () => {
    const authUseCaseSpy = createAuthUseCaseSpyFactory()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator has no isValid method', async () => {
    const authUseCaseSpy = createAuthUseCaseSpyFactory()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if EmailValidator throws an error', async () => {
    const { sut } = createSutFactoryWithEmailValidatorThrowingError()
    const httpRequest = FAKE_HTTP_REQUEST
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = createSutFactory()
    const httpRequest = FAKE_HTTP_REQUEST
    await sut.route(httpRequest)
    expect(httpRequest.body.email).toBe(emailValidatorSpy.email)
  })
})
