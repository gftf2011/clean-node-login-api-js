const AuthUseCaseSpy = require('../../../../../spies/auth-use-case-spy')

const { FAKE_ACCESS_TOKEN } = require('../../constants/constants')

module.exports = class AuthUseCaseSpyFactory {
  create () {
    this.authUseCaseSpy = new AuthUseCaseSpy()
    this.authUseCaseSpy.accessToken = FAKE_ACCESS_TOKEN
    return this.authUseCaseSpy
  }
}
