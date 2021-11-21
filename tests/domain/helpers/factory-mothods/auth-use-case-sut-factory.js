const ServerError = require('../../../../src/utils/errors/server-error');

const DependenciesFactory = require('../abstract-factories/auth-use-case-dependencies-factory');

const AuthUseCase = require('../../../../src/domain/use-cases/auth-use-case');

const {
  LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT,
  ENCRYPTER_WITH_ERROR_SUT,
  TOKEN_GENERATOR_WITH_ERROR_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT) {
      this.dependencies.loadUserByEmailRepositorySpy.load = async () => {
        throw new ServerError();
      };
    } else if (type === ENCRYPTER_WITH_ERROR_SUT) {
      this.dependencies.encrypterSpy.compare = async () => {
        throw new ServerError();
      };
    } else if (type === TOKEN_GENERATOR_WITH_ERROR_SUT) {
      this.dependencies.tokenGeneratorSpy.generate = async () => {
        throw new ServerError();
      };
    } else if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT) {
      this.dependencies.updateAccessTokenRepositorySpy.update = async () => {
        throw new ServerError();
      };
    }

    this.sut = new AuthUseCase({
      loadUserByEmailRepository: this.dependencies.loadUserByEmailRepositorySpy,
      updateAccessTokenRepository:
        this.dependencies.updateAccessTokenRepositorySpy,
      encrypter: this.dependencies.encrypterSpy,
      tokenGenerator: this.dependencies.tokenGeneratorSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
