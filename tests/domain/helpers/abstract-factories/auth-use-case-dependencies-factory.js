const UpdateAccessTokenRepositorySpyFactory = require('./spies/update-access-token-repository-spy-factory');
const EncrypterSpyFactory = require('./spies/encrypter-spy-factory');
const LoadUserByEmailRepositorySpyFactory = require('./spies/load-user-by-email-repository-spy-factory');
const TokenGeneratorSpyFactory = require('./spies/token-generator-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.updateAccessTokenRepositorySpy =
      new UpdateAccessTokenRepositorySpyFactory().create();
    this.encrypterSpy = new EncrypterSpyFactory().create();
    this.loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    this.tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    return {
      updateAccessTokenRepositorySpy: this.updateAccessTokenRepositorySpy,
      encrypterSpy: this.encrypterSpy,
      loadUserByEmailRepositorySpy: this.loadUserByEmailRepositorySpy,
      tokenGeneratorSpy: this.tokenGeneratorSpy,
    };
  }
};
