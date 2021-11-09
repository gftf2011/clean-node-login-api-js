class AuthUseCase {
  async execute (email, password) {
    if (!email) {
      throw new Error()
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
    expect(promise).rejects.toThrow()
  })
})
