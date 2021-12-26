const DependenciesFactory = require('../abstract-factories/logout-use-case-dependencies-factory');

const LogOutUseCase = require('../../../../src/domain/use-cases/logout-use-case');

const {
  LOG_OUT_USE_CASE_SUT_LOAD_USER_BY_ID_REPOSITORY_WITH_ERROR,
} = require('../constants');

const ServerError = require('../../../../src/utils/errors/server-error');

module.exports = class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (type === LOG_OUT_USE_CASE_SUT_LOAD_USER_BY_ID_REPOSITORY_WITH_ERROR) {
      this.dependencies.loadUserByIdRepositorySpy.load = () => {
        return Promise.reject(new ServerError());
      };
    }

    this.sut = new LogOutUseCase({
      loadUserByIdRepository: this.dependencies.loadUserByIdRepositorySpy,
      updateAccessTokenRepository:
        this.dependencies.updateAccessTokenRepositorySpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
