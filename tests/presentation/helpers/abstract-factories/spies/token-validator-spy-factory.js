const TokenValidatorSpy = require('../../../../../spies/token-validator-spy');

module.exports = class TokenValidatorSpyFactory {
  create() {
    this.tokenValidatorSpy = new TokenValidatorSpy();
    this.tokenValidatorSpy.userId = null;
    return this.tokenValidatorSpy;
  }
};
