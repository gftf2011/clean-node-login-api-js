const MissingParamError = require('../../../src/utils/errors/missing-param-error')
const ServerError = require('../../../src/utils/errors/server-error')

const AuthUseCase = require('../../../src/domain/use-cases/auth-use-case')

const TokenGeneratorSpy = require('../../../spys/token-generator-spy')
const EncrypterSpy = require('../../../spys/encrypter-spy')
const LoadUserByEmailRepositorySpy = require('../../../spys/load-user-by-email-repository-spy')

const FAKE_GENERIC_ACCESS_TOKEN = 'any_token'
const FAKE_GENERIC_USER_ID = 'any_user_id'
const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_HASHED_PASSWORD = 'hashed_password'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password'

const createTokenGeneratorSpyFactory = () => {
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN
  return tokenGeneratorSpy
}

const createEncrypterSpyFactory = () => {
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const createLoadUserByEmailRepositorySpyFactory = () => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    id: FAKE_GENERIC_USER_ID,
    password: FAKE_HASHED_PASSWORD
  }
  return loadUserByEmailRepositorySpy
}

const createSutFactory = () => {
  const encrypterSpy = createEncrypterSpyFactory()
  const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpyFactory()
  const tokenGeneratorSpy = createTokenGeneratorSpyFactory()
  const sut = new AuthUseCase({
    loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy,
    tokenGeneratorSpy
  }
}

describe('Auth UseCase', () => {
  it('Should throw error if no email is provided', () => {
    const { sut } = createSutFactory()
    const promise = sut.execute(undefined, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw error if no password is provided', () => {
    const { sut } = createSutFactory()
    const promise = sut.execute(FAKE_GENERIC_EMAIL, undefined)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = createSutFactory()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(FAKE_GENERIC_EMAIL).toBe(loadUserByEmailRepositorySpy.email)
  })

  it('Should throw error if no dependency is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if no LoadUserByEmailRepository is provided', () => {
    const sut = new AuthUseCase({})
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if LoadUserByEmailRepository has no load method', () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = createSutFactory()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.execute(INVALID_FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBeNull()
  })

  it('Should return null if invalid password is provided', async () => {
    const { sut, encrypterSpy } = createSutFactory()
    encrypterSpy.isValid = false
    const accessToken = await sut.execute(FAKE_GENERIC_EMAIL, INVALID_FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBeNull()
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = createSutFactory()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(encrypterSpy.password).toBe(FAKE_GENERIC_PASSWORD)
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  it('Should throw error if no Encrypter is provided', () => {
    const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpyFactory()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if Encrypter has no compare method', () => {
    const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpyFactory()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: {}
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = createSutFactory()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('Should throw error if no TokenGenerator is provided', () => {
    const encrypterSpy = createEncrypterSpyFactory()
    const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpyFactory()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if TokenGenerator has no generate method', () => {
    const encrypterSpy = createEncrypterSpyFactory()
    const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpyFactory()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: {}
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should return an accessToken if correct credentials are provided', async () => {
    const { sut } = createSutFactory()
    const accessToken = await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBe(FAKE_GENERIC_ACCESS_TOKEN)
  })
})
