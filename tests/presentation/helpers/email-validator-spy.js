module.exports = class EmailValidatorSpy {
  isValid (email) {
    this.email = email
    return this.isEmailValid
  }
}
