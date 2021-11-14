const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

const createSutFactory = () => {
  const sut = new LoadUserByEmailRepository()
  return { sut }
}

describe('LoadUserByEmail Repository', () => {
  it('Should return null if no user is found', async () => {
    const { sut } = createSutFactory()
    const user = await sut.load(INVALID_FAKE_GENERIC_EMAIL)
    expect(user).toBeNull()
  })
})
