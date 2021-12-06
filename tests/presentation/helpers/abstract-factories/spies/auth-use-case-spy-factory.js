const AuthUseCaseSpy = require('../../../../../spies/auth-use-case-spy');

module.exports = class AuthUseCaseSpyFactory {
  create() {
    this.authUseCaseSpy = new AuthUseCaseSpy();
    return this.authUseCaseSpy;
  }
};
