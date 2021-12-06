const ServerError = require('../../../../src/utils/errors/server-error');

const DependenciesFactory = require('../abstract-factories/sign-up-use-case-dependencies-factory');

const SignUpUseCase = require('../../../../src/domain/use-cases/sign-up-use-case');

const {
  SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
} = require('../constants');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (
      type === SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR
    ) {
      this.dependencies.loadUserByEmailRepositorySpy.load = () => {
        throw new ServerError();
      };
    } else if (type === SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR) {
      this.dependencies.encrypterSpy.hash = () => {
        throw new ServerError();
      };
    } else if (
      type === SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR
    ) {
      this.dependencies.insertUserRepositorySpy.insert = () => {
        throw new ServerError();
      };
    } else if (type === SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR) {
      this.dependencies.tokenGeneratorSpy.generate = () => {
        throw new ServerError();
      };
    } else if (
      type === SIGN_UP_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR
    ) {
      this.dependencies.updateAccessTokenRepositorySpy.update = () => {
        throw new ServerError();
      };
    }

    this.sut = new SignUpUseCase({
      updateAccessTokenRepository:
        this.dependencies.updateAccessTokenRepositorySpy,
      loadUserByEmailRepository: this.dependencies.loadUserByEmailRepositorySpy,
      insertUserRepository: this.dependencies.insertUserRepositorySpy,
      encrypter: this.dependencies.encrypterSpy,
      tokenGenerator: this.dependencies.tokenGeneratorSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
