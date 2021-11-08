module.exports = class EmailValidatorSpy {
  isValid (_email) {
    return this.isEmailValid
  }
}
