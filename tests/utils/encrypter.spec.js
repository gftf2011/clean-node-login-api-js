const Encrypter = require('../../src/utils/encrypter')

const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_HASHED_PASSWORD = 'hashed_password'

const createSutFactory = () => {
  const sut = new Encrypter()
  return {
    sut
  }
}

describe('Encrypter', () => {
  it('Should return "true" if bcrypt returns "true"', async () => {
    const { sut } = createSutFactory()
    const isValid = await sut.compare(FAKE_GENERIC_PASSWORD, FAKE_HASHED_PASSWORD)
    expect(isValid).toBe(true)
  })
})
