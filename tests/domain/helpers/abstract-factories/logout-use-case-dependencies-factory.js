const LoadUserByIdRepositorySpyFactory = require('./spies/load-user-by-id-repository-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.loadUserByIdRepositorySpy =
      new LoadUserByIdRepositorySpyFactory().create();
    return {
      loadUserByIdRepositorySpy: this.loadUserByIdRepositorySpy,
    };
  }
};
