const MissingParamError = require('../../../src/utils/errors/missing-param-error')
const ServerError = require('../../../src/utils/errors/server-error')

const AuthUseCase = require('../../../src/domain/use-cases/auth-use-case')

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_HASHED_PASSWORD = 'hashed_password'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password'

const createEncrypterSpyFactory = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const createLoadUserByEmailRepositorySpyFactory = () => {
  class LoadUserByEmailRepositorySpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  loadUserByEmailRepositorySpy.user = {
    password: FAKE_HASHED_PASSWORD
  }
  return loadUserByEmailRepositorySpy
}

const createSutFactory = () => {
  const encrypterSpy = createEncrypterSpyFactory()
  const loadUserByEmailRepositorySpy = createLoadUserByEmailRepositorySpyFactory()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepositorySpy,
    encrypterSpy
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

  it('Should throw error if no LoadUserByEmailRepository is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if LoadUserByEmailRepository has no load method', () => {
    const sut = new AuthUseCase({})
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
})
