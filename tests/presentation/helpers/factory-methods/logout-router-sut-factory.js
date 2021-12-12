const LogOutRouter = require('../../../../src/presentation/routers/logout-router');

const DependenciesFactory = require('../abstract-factories/logout-router-dependencies-factory');

module.exports = class SutFactory {
  create(_type) {
    this.dependencies = new DependenciesFactory().create();
    this.sut = new LogOutRouter({
      tokenValidator: this.dependencies.tokenValidatorSpy,
      logOutUseCase: this.dependencies.logOutUseCaseSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
