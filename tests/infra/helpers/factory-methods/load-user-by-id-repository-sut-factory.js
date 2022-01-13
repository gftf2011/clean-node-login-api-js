const LoadUserByIdRepository = require('../../../../src/infra/repositories/load-user-by-id-repository');

const {
  LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY,
  LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY_OBJECT,
  LOAD_USER_BY_ID_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
} = require('../constants');

module.exports = class SutFactory {
  constructor(db) {
    this.db = db;
  }

  create(type) {
    this.userModel = this.db.collection('users');

    if (type === LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY) {
      this.sut = new LoadUserByIdRepository();
    } else if (type === LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY_OBJECT) {
      this.sut = new LoadUserByIdRepository({});
    } else if (
      type === LOAD_USER_BY_ID_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT
    ) {
      this.sut = new LoadUserByIdRepository({ userModel: {} });
    } else {
      this.sut = new LoadUserByIdRepository({ userModel: this.userModel });
    }

    return {
      sut: this.sut,
      userModel: this.userModel,
    };
  }
};
