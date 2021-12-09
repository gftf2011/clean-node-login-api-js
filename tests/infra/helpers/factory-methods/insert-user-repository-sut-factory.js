const InsertUserRepository = require('../../../../src/infra/repositories/insert-user-repository');

const {
  INSERT_USER_REPOSITORY_SUT_EMPTY,
  INSERT_USER_REPOSITORY_SUT_EMPTY_OBJECT,
  INSERT_USER_REPOSITORY_SUT_EMPTY_USER_MODEL_OBJECT,
} = require('../constants');

module.exports = class SutFactory {
  constructor(db) {
    this.db = db;
  }

  create(type) {
    this.userModel = this.db.collection('users');

    if (type === INSERT_USER_REPOSITORY_SUT_EMPTY) {
      this.sut = new InsertUserRepository();
    } else if (type === INSERT_USER_REPOSITORY_SUT_EMPTY_OBJECT) {
      this.sut = new InsertUserRepository({});
    } else if (type === INSERT_USER_REPOSITORY_SUT_EMPTY_USER_MODEL_OBJECT) {
      this.sut = new InsertUserRepository({ userModel: {} });
    } else {
      this.sut = new InsertUserRepository({ userModel: this.userModel });
    }

    return {
      sut: this.sut,
      userModel: this.userModel,
    };
  }
};
