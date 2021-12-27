const LoadUserByIdRepository = require('../../../../src/infra/repositories/load-user-by-id-repository');

module.exports = class SutFactory {
  constructor(db) {
    this.db = db;
  }

  create(_type) {
    this.userModel = this.db.collection('users');

    this.sut = new LoadUserByIdRepository({ userModel: this.userModel });

    return {
      sut: this.sut,
      userModel: this.userModel,
    };
  }
};
