const TokenGeneratorSpy = require('../../../../../spies/token-generator-spy')

const { FAKE_GENERIC_ACCESS_TOKEN } = require('../../constants/constants')

module.exports = class TokenGeneratorSpyFactory {
  create () {
    this.tokenGeneratorSpy = new TokenGeneratorSpy()
    this.tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN
    return this.tokenGeneratorSpy
  }
}
