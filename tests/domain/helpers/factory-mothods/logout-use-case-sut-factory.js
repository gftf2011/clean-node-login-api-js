const DependenciesFactory = require('../abstract-factories/logout-use-case-dependencies-factory');

const LogOutUseCase = require('../../../../src/domain/use-cases/logout-use-case');

module.exports = class SutFactory {
  create(_type) {
    this.dependencies = new DependenciesFactory().create();

    this.sut = new LogOutUseCase({
      loadUserByIdRepository: this.dependencies.loadUserByIdRepositorySpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
