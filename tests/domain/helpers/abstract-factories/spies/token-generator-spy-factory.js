const TokenGeneratorSpy = require('../../../../../spies/token-generator-spy');

module.exports = class TokenGeneratorSpyFactory {
  create() {
    this.tokenGeneratorSpy = new TokenGeneratorSpy();
    return this.tokenGeneratorSpy;
  }
};
