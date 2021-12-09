const LoadUserByEmailRepositorySpy = require('../../../../../spies/load-user-by-email-repository-spy');

module.exports = class LoadUserByEmailRepositorySpyFactory {
  create() {
    this.loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    return this.loadUserByEmailRepositorySpy;
  }
};
