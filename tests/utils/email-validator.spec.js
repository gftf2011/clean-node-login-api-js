class EmailValidator {
  isValid (email) {
    this.email = email
    return true
  }
}

describe('Email Validator', () => {
  it('Should return "true" if validator returns "true"', () => {
    const sut = new EmailValidator()
    const isEmailValid = sut.isValid('test001@gmail.com')
    expect(isEmailValid).toBe(true)
  })
})
