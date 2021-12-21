const LoadUserByIdRepositorySpyFactory = require('./spies/load-user-by-id-repository-spy-factory');
const UpdateAccessTokenRepositorySpyFactory = require('./spies/update-access-token-repository-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.updateAccessTokenRepositorySpy =
      new UpdateAccessTokenRepositorySpyFactory().create();
    this.loadUserByIdRepositorySpy =
      new LoadUserByIdRepositorySpyFactory().create();
    return {
      loadUserByIdRepositorySpy: this.loadUserByIdRepositorySpy,
      updateAccessTokenRepositorySpy: this.updateAccessTokenRepositorySpy,
    };
  }
};
