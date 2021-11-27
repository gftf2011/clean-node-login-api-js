const SignUpUseCaseSpy = require('../../../../../spies/sign-up-use-case-spy');

const { FAKE_ACCESS_TOKEN } = require('../../constants');

module.exports = class SignUpUseCaseSpyFactory {
  create() {
    this.signUpUseCaseSpy = new SignUpUseCaseSpy();
    this.signUpUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN;
    return this.signUpUseCaseSpy;
  }
};
