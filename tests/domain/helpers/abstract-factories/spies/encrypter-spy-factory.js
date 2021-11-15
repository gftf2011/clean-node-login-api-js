const EncrypterSpy = require('../../../../../spies/encrypter-spy')

module.exports = class EncrypterSpyFactory {
  create () {
    this.encrypterSpy = new EncrypterSpy()
    this.encrypterSpy.isValid = true
    return this.encrypterSpy
  }
}
