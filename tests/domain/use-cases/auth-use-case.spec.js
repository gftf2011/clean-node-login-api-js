const MissingParamError = require('../../../src/utils/errors/missing-param-error')
const ServerError = require('../../../src/utils/errors/server-error')

const AuthUseCase = require('../../../src/domain/use-cases/auth-use-case')

const TokenGeneratorSpy = require('../../../spies/token-generator-spy')
const EncrypterSpy = require('../../../spies/encrypter-spy')
const LoadUserByEmailRepositorySpy = require('../../../spies/load-user-by-email-repository-spy')
const UpdateAccessTokenRepositorySpy = require('../../../spies/update-access-token-repository-spy')

const FAKE_GENERIC_ACCESS_TOKEN = 'any_token'
const FAKE_GENERIC_USER_ID = 'any_user_id'
const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_HASHED_PASSWORD = 'hashed_password'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password'

class UpdateAccessTokenRepositorySpyFactory {
  create () {
    this.updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
    return this.updateAccessTokenRepositorySpy
  }
}

class TokenGeneratorSpyFactory {
  create () {
    this.tokenGeneratorSpy = new TokenGeneratorSpy()
    this.tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN
    return this.tokenGeneratorSpy
  }
}

class EncrypterSpyFactory {
  create () {
    this.encrypterSpy = new EncrypterSpy()
    this.encrypterSpy.isValid = true
    return this.encrypterSpy
  }
}

class LoadUserByEmailRepositorySpyFactory {
  create () {
    this.loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy()
    this.loadUserByEmailRepositorySpy.user = {
      id: FAKE_GENERIC_USER_ID,
      password: FAKE_HASHED_PASSWORD
    }
    return this.loadUserByEmailRepositorySpy
  }
}

class DependenciesFactory {
  create () {
    this.updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpyFactory().create()
    this.encrypterSpy = new EncrypterSpyFactory().create()
    this.loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    this.tokenGeneratorSpy = new TokenGeneratorSpyFactory().create()
    return {
      updateAccessTokenRepositorySpy: this.updateAccessTokenRepositorySpy,
      encrypterSpy: this.encrypterSpy,
      loadUserByEmailRepositorySpy: this.loadUserByEmailRepositorySpy,
      tokenGeneratorSpy: this.tokenGeneratorSpy
    }
  }
}

const LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT = 'LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT'
const ENCRYPTER_WITH_ERROR_SUT = 'ENCRYPTER_WITH_ERROR_SUT'
const TOKEN_GENERATOR_WITH_ERROR_SUT = 'TOKEN_GENERATOR_WITH_ERROR_SUT'
const UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT = 'UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT'

class SutFactory {
  create (type) {
    this.dependencies = new DependenciesFactory().create()

    if (type === LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT) {
      this.dependencies.loadUserByEmailRepositorySpy.load = async () => {
        throw new ServerError()
      }
    } else if (type === ENCRYPTER_WITH_ERROR_SUT) {
      this.dependencies.encrypterSpy.compare = async () => {
        throw new ServerError()
      }
    } else if (type === TOKEN_GENERATOR_WITH_ERROR_SUT) {
      this.dependencies.tokenGeneratorSpy.generate = async () => {
        throw new ServerError()
      }
    } else if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT) {
      this.dependencies.updateAccessTokenRepositorySpy.update = async () => {
        throw new ServerError()
      }
    }

    this.sut = new AuthUseCase({
      loadUserByEmailRepository: this.dependencies.loadUserByEmailRepositorySpy,
      updateAccessTokenRepository: this.dependencies.updateAccessTokenRepositorySpy,
      encrypter: this.dependencies.encrypterSpy,
      tokenGenerator: this.dependencies.tokenGeneratorSpy
    })

    return {
      sut: this.sut,
      ...this.dependencies
    }
  }
}

describe('Auth UseCase', () => {
  it('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create()
    loadUserByEmailRepositorySpy.user = null
    const accessToken = await sut.execute(INVALID_FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBeNull()
  })

  it('Should return null if invalid password is provided', async () => {
    const { sut, encrypterSpy } = new SutFactory().create()
    encrypterSpy.isValid = false
    const accessToken = await sut.execute(FAKE_GENERIC_EMAIL, INVALID_FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBeNull()
  })

  it('Should return an accessToken if correct credentials are provided', async () => {
    const { sut } = new SutFactory().create()
    const accessToken = await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBe(FAKE_GENERIC_ACCESS_TOKEN)
  })

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(FAKE_GENERIC_EMAIL).toBe(loadUserByEmailRepositorySpy.email)
  })

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } = new SutFactory().create()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(encrypterSpy.password).toBe(FAKE_GENERIC_PASSWORD)
    expect(encrypterSpy.hashedPassword).toBe(loadUserByEmailRepositorySpy.user.password)
  })

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } = new SutFactory().create()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy, updateAccessTokenRepositorySpy } = new SutFactory().create()
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(updateAccessTokenRepositorySpy.userId).toBe(loadUserByEmailRepositorySpy.user.id)
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(tokenGeneratorSpy.accessToken)
  })

  it('Should throw error if no email is provided', () => {
    const { sut } = new SutFactory().create()
    const promise = sut.execute(undefined, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw error if no password is provided', () => {
    const { sut } = new SutFactory().create()
    const promise = sut.execute(FAKE_GENERIC_EMAIL, undefined)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
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

  it('Should throw error if no Encrypter is provided', () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if Encrypter has no compare method', () => {
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: {}
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if no TokenGenerator is provided', () => {
    const encrypterSpy = new EncrypterSpyFactory().create()
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if TokenGenerator has no generate method', () => {
    const encrypterSpy = new EncrypterSpyFactory().create()
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: {}
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if no UpdateAccessTokenRepository is provided', () => {
    const encrypterSpy = new EncrypterSpyFactory().create()
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    const tokenGeneratorSpy = new TokenGeneratorSpyFactory().create()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if UpdateAccessTokenRepository has no update method', () => {
    const encrypterSpy = new EncrypterSpyFactory().create()
    const loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpyFactory().create()
    const tokenGeneratorSpy = new TokenGeneratorSpyFactory().create()
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
      updateAccessTokenRepository: {}
    })
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if LoadUserByEmailRepositorySpy throws error', () => {
    const { sut } = new SutFactory().create(LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT)
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if Encrypter throws error', () => {
    const { sut } = new SutFactory().create(ENCRYPTER_WITH_ERROR_SUT)
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if TokenGenerator throws error', () => {
    const { sut } = new SutFactory().create(TOKEN_GENERATOR_WITH_ERROR_SUT)
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw error if UpdateAccessTokenRepository throws error', () => {
    const { sut } = new SutFactory().create(UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT)
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new ServerError())
  })
})
