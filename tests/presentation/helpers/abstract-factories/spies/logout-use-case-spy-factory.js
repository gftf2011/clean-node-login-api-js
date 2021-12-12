const LogOutUseCaseSpy = require('../../../../../spies/logout-use-case-spy');

module.exports = class LogOutUseCaseSpyFactory {
  create() {
    this.logOutUseCaseSpy = new LogOutUseCaseSpy();
    this.logOutUseCaseSpy.isLoggedOut = false;
    return this.logOutUseCaseSpy;
  }
};
