module.exports = class EncrypterSpy {
  async compare (password, hashedPassword) {
    this.password = password
    this.hashedPassword = hashedPassword
    return this.isValid
  }
}
