const TokenGenerator = require('../../../../src/utils/generators/token-generator')

const { FAKE_GENERIC_SECRET } = require('../constants')

module.exports = class SutFactory {
  create () {
    this.sut = new TokenGenerator({ secret: FAKE_GENERIC_SECRET })
    return { sut: this.sut }
  }
}
