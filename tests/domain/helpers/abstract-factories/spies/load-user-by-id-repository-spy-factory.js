const LoadUserByIdRepositorySpy = require('../../../../../spies/load-user-by-id-repository-spy');

module.exports = class LoadUserByIdRepositorySpyFactory {
  create() {
    this.loadUserByIdRepositorySpy = new LoadUserByIdRepositorySpy();
    return this.loadUserByIdRepositorySpy;
  }
};
