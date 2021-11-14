const jwt = require('jsonwebtoken')

const ServerError = require('../../../src/utils/errors/server-error')

const FAKE_GENERIC_ID = 'any_id'
const FAKE_GENERIC_TOKEN = 'any_token'
const FAKE_GENERIC_SECRET = 'any_secret'

class TokenGenerator {
  constructor ({ secret } = {}) {
    this.secret = secret
  }

  async generate (id) {
    if (!this.secret) {
      throw new ServerError()
    }
    return jwt.sign(id, this.secret)
  }
}

const createSutFactory = () => {
  const sut = new TokenGenerator({ secret: FAKE_GENERIC_SECRET })
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

  it('Should throw ServerError if no dependency is provided', () => {
    const sut = new TokenGenerator()
    const promise = sut.generate(FAKE_GENERIC_ID)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw ServerError if no secret is provided', () => {
    const sut = new TokenGenerator({})
    const promise = sut.generate(FAKE_GENERIC_ID)
    expect(promise).rejects.toThrow(new ServerError())
  })
})
