const TokenValidatorSpyFactory = require('./spies/token-validator-spy-factory');
const LogOutUseCaseSpyFactory = require('./spies/logout-use-case-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.tokenValidatorSpy = new TokenValidatorSpyFactory().create();
    this.logOutUseCaseSpy = new LogOutUseCaseSpyFactory().create();
    return {
      tokenValidatorSpy: this.tokenValidatorSpy,
      logOutUseCaseSpy: this.logOutUseCaseSpy,
    };
  }
};
