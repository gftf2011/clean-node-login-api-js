const ServerError = require('../../../../src/utils/errors/server-error');

const DependenciesFactory = require('../abstract-factories/auth-use-case-dependencies-factory');

const AuthUseCase = require('../../../../src/domain/use-cases/auth-use-case');

const {
  AUTH_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
  AUTH_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
  AUTH_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
  AUTH_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === AUTH_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR) {
      this.dependencies.loadUserByEmailRepositorySpy.load = () => {
        throw new ServerError();
      };
    } else if (type === AUTH_USE_CASE_SUT_ENCRYPTER_WITH_ERROR) {
      this.dependencies.encrypterSpy.compare = () => {
        throw new ServerError();
      };
    } else if (type === AUTH_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR) {
      this.dependencies.tokenGeneratorSpy.generate = () => {
        throw new ServerError();
      };
    } else if (
      type === AUTH_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR
    ) {
      this.dependencies.updateAccessTokenRepositorySpy.update = () => {
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
