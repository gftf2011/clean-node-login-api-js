const jwt = require('jsonwebtoken')

const FAKE_GENERIC_ID = 'any_id'
const FAKE_GENERIC_TOKEN = 'any_token'
const FAKE_GENERIC_SECRET = 'any_secret'

const createSutFactory = () => {
  class TokenGenerator {
    constructor (secret) {
      this.secret = secret
    }

    async generate (id) {
      return jwt.sign(id, this.secret)
    }
  }
  const sut = new TokenGenerator(FAKE_GENERIC_SECRET)
  return { sut }
}

describe('Token Generator', () => {
  it('Should call JWT with correct values', async () => {
    const { sut } = createSutFactory()
    await sut.generate(FAKE_GENERIC_ID)
    expect(jwt.payload).toBe(FAKE_GENERIC_ID)
    expect(jwt.secret).toBe(sut.secret)
  })

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
