const Encrypter = require('../../../src/utils/encrypter')

module.exports = class SutFactory {
  create () {
    this.sut = new Encrypter()
    return { sut: this.sut }
  }
}
