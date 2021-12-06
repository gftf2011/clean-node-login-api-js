const SignUpUseCaseSpy = require('../../../../../spies/sign-up-use-case-spy');

module.exports = class SignUpUseCaseSpyFactory {
  create() {
    this.signUpUseCaseSpy = new SignUpUseCaseSpy();
    return this.signUpUseCaseSpy;
  }
};
