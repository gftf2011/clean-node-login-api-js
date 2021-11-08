const validator = require('validator')

class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  const sut = new EmailValidator()
  return { sut }
}

const VALID_EMAIL = 'validtest001@gmail.com'
const INVALID_EMAIL = 'invalidtest001@gmail.com'

describe('Email Validator', () => {
  it('Should return "true" if validator returns "true"', () => {
    validator.isEmailValid = true
    const { sut } = makeSut()
    const isEmailValid = sut.isValid(VALID_EMAIL)
    expect(isEmailValid).toBe(true)
  })

  it('Should return "false" if validator returns "false"', () => {
    validator.isEmailValid = false
    const { sut } = makeSut()
    const isEmailValid = sut.isValid(INVALID_EMAIL)
    expect(isEmailValid).toBe(false)
  })

  it('Should call validator with correct email', () => {
    const { sut } = makeSut()
    sut.isValid(VALID_EMAIL)
    expect(validator.email).toBe(VALID_EMAIL)
  })
})
