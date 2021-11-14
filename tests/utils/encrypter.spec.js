const bcrypt = require('bcrypt')

const MissingParamError = require('../../src/utils/errors/missing-param-error')

const Encrypter = require('../../src/utils/encrypter')

const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_HASHED_PASSWORD = 'hashed_password'
const FAKE_WRONG_HASHED_PASSWORD = 'wrong_hashed_password'

class SutFactory {
  create () {
    this.sut = new Encrypter()
    return { sut: this.sut }
  }
}

describe('Encrypter', () => {
  it('Should call bcrypt with correct values', async () => {
    const { sut } = new SutFactory().create()
    await sut.compare(FAKE_GENERIC_PASSWORD, FAKE_HASHED_PASSWORD)
    expect(bcrypt.value).toBe(FAKE_GENERIC_PASSWORD)
    expect(bcrypt.hashValue).toBe(FAKE_HASHED_PASSWORD)
  })

  it('Should return "true" if bcrypt returns "true"', async () => {
    const { sut } = new SutFactory().create()
    const isValid = await sut.compare(FAKE_GENERIC_PASSWORD, FAKE_HASHED_PASSWORD)
    expect(isValid).toBe(true)
  })

  it('Should return "false" if bcrypt returns "false"', async () => {
    bcrypt.isValid = false
    const { sut } = new SutFactory().create()
    const isValid = await sut.compare(FAKE_GENERIC_PASSWORD, FAKE_WRONG_HASHED_PASSWORD)
    expect(isValid).toBe(false)
  })

  it('Should throw MissingParamError if no value is provided', () => {
    const { sut } = new SutFactory().create()
    const promise = sut.compare()
    expect(promise).rejects.toThrow(new MissingParamError('value'))
  })

  it('Should throw MissingParamError if no hashValue is provided', () => {
    const { sut } = new SutFactory().create()
    const promise = sut.compare(FAKE_GENERIC_PASSWORD)
    expect(promise).rejects.toThrow(new MissingParamError('hashValue'))
  })
})
