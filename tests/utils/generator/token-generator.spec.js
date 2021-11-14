const jwt = require('jsonwebtoken')

const FAKE_GENERIC_ID = 'any_id'
const FAKE_GENERIC_TOKEN = 'any_token'

const createSutFactory = () => {
  class TokenGenerator {
    async generate (id) {
      return jwt.sign(id, 'secret')
    }
  }
  const sut = new TokenGenerator()
  return { sut }
}

describe('Token Generator', () => {
  it('Should return "null" if JWT returns "null"', async () => {
    const { sut } = createSutFactory()
    const token = await sut.generate(FAKE_GENERIC_ID)
    expect(token).toBeNull()
  })

  it('Should return a token if JWT returns a token', async () => {
    jwt.token = FAKE_GENERIC_TOKEN
    const { sut } = createSutFactory()
    const token = await sut.generate(FAKE_GENERIC_ID)
    expect(token).toBe(FAKE_GENERIC_TOKEN)
  })
})
