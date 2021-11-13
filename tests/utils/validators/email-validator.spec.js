const validator = require('validator')

const MissingParamError = require('../../../src/utils/errors/missing-param-error')

const EmailValidator = require('../../../src/utils/validators/email-validator')

const createSutFactory = () => {
  const sut = new EmailValidator()
  return { sut }
}

const VALID_EMAIL = 'validtest001@gmail.com'
const INVALID_EMAIL = 'invalidtest001@gmail.com'

describe('Email Validator', () => {
  it('Should call validator with correct email', () => {
    const { sut } = createSutFactory()
    sut.isValid(VALID_EMAIL)
    expect(validator.email).toBe(VALID_EMAIL)
  })

  it('Should return "true" if validator returns "true"', () => {
    validator.isEmailValid = true
    const { sut } = createSutFactory()
    const isEmailValid = sut.isValid(VALID_EMAIL)
    expect(isEmailValid).toBe(true)
  })

  it('Should return "false" if validator returns "false"', () => {
    validator.isEmailValid = false
    const { sut } = createSutFactory()
    const isEmailValid = sut.isValid(INVALID_EMAIL)
    expect(isEmailValid).toBe(false)
  })

  it('Should throws MissingParamError if no email is provided', () => {
    const { sut } = createSutFactory()
    expect(() => { sut.isValid() }).toThrow(new MissingParamError('email'))
  })
})
