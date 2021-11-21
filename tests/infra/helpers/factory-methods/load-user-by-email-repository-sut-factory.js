const LoadUserByEmailRepository = require('../../../../src/infra/repositories/load-user-by-email-repository');

const {
  LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_SUT,
  LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_OBJECT_SUT,
  LOAD_USER_BY_EMAIL_REPOSITORY_WITH_EMPTY_USER_MODEL_OBJECT_SUT,
} = require('../constants');

module.exports = class SutFactory {
  constructor(db) {
    this.db = db;
  }

  create(type) {
    this.userModel = this.db.collection('users');

    if (type === LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_SUT) {
      this.sut = new LoadUserByEmailRepository();
    } else if (type === LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_OBJECT_SUT) {
      this.sut = new LoadUserByEmailRepository({});
    } else if (
      type === LOAD_USER_BY_EMAIL_REPOSITORY_WITH_EMPTY_USER_MODEL_OBJECT_SUT
    ) {
      this.sut = new LoadUserByEmailRepository({ userModel: {} });
    } else {
      this.sut = new LoadUserByEmailRepository({ userModel: this.userModel });
    }

    return {
      sut: this.sut,
      userModel: this.userModel,
    };
  }
};
