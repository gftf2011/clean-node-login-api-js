class AuthUseCase {
  async execute (email, password) {
    if (!email) {
      return null
    }
  }
}

const FAKE_GENERIC_PASSWORD = 'any_password'

const makeSut = () => {
  const sut = new AuthUseCase()
  return { sut }
}

describe('Auth UseCase', () => {
  it('Should return null if no email is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.execute(undefined, FAKE_GENERIC_PASSWORD)
    expect(accessToken).toBeNull()
  })
})
