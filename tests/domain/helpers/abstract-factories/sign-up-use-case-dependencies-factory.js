const UpdateAccessTokenRepositorySpyFactory = require('./spies/update-access-token-repository-spy-factory');
const EncrypterSpyFactory = require('./spies/encrypter-spy-factory');
const LoadUserByEmailRepositorySpyFactory = require('./spies/load-user-by-email-repository-spy-factory');
const TokenGeneratorSpyFactory = require('./spies/token-generator-spy-factory');
const InsertUserRepositorySpyFactory = require('./spies/insert-user-repository-spy-factory');

module.exports = class DependenciesFactory {
  create() {
    this.encrypterSpy = new EncrypterSpyFactory().create();
    this.loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    this.insertUserRepositorySpy =
      new InsertUserRepositorySpyFactory().create();
    this.tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    this.updateAccessTokenRepositorySpy =
      new UpdateAccessTokenRepositorySpyFactory().create();
    return {
      encrypterSpy: this.encrypterSpy,
      loadUserByEmailRepositorySpy: this.loadUserByEmailRepositorySpy,
      insertUserRepositorySpy: this.insertUserRepositorySpy,
      tokenGeneratorSpy: this.tokenGeneratorSpy,
      updateAccessTokenRepositorySpy: this.updateAccessTokenRepositorySpy,
    };
  }
};
