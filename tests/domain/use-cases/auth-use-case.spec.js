const MissingParamError = require('../../../src/utils/errors/missing-param-error')
const ServerError = require('../../../src/utils/errors/server-error')

const AuthUseCase = require('../../../src/domain/use-cases/auth-use-case')

class LoadUserByEmailRepositorySpy {
  async load (email) {
    this.email = email
  }
}

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_GENERIC_PASSWORD = 'any_password'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

const makeSut = () => {
  const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
  const sut = new AuthUseCase(loadUserByEmailRepositorySpy)
  return {
    sut,
    loadUserByEmailRepositorySpy
  }
}

describe('Auth UseCase', () => {
  it('Should throw error if no email is provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute(undefined, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw error if no password is provided', () => {
    const { sut } = makeSut()
    const promise = sut.execute(FAKE_GENERIC_EMAIL, undefined)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = makeSut()
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

  it('Should return null if LoadUserByEmailRepository returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.execute(INVALID_FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBeNull()
  })
})
