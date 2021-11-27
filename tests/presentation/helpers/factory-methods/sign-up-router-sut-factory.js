const SignUpRouter = require('../../../../src/presentation/routers/sign-up-router');

const DependenciesFactory = require('../abstract-factories/sign-up-router-dependencies-factory');

module.exports = class SutFactory {
  create(_type) {
    this.dependencies = new DependenciesFactory().create();

    this.sut = new SignUpRouter({
      emailValidator: this.dependencies.emailValidatorSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
};
