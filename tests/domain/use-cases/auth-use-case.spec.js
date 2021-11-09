const MissingParamError = require('../../../src/utils/errors/missing-param-error')

class AuthUseCase {
  async execute (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    } else if (!password) {
      throw new MissingParamError('password')
    }
  }
}

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_GENERIC_PASSWORD = 'any_password'

const makeSut = () => {
  const sut = new AuthUseCase()
  return { sut }
}

describe('Auth UseCase', () => {
  it('Should throw error if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.execute(undefined, FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should throw error if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.execute(FAKE_GENERIC_EMAIL, undefined)
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })
})
