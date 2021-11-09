const MissingParamError = require('../../../src/utils/errors/missing-param-error')

class AuthUseCase {
  async execute (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
  }
}

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
})
