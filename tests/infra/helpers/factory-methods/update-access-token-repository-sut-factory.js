const UpdateAccessTokenRepository = require('../../../../src/infra/repositories/update-access-token-repository');

const {
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
} = require('../constants');

module.exports = class SutFactory {
  constructor(db) {
    this.db = db;
  }

  create(type) {
    this.userModel = this.db.collection('users');

    if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY) {
      this.sut = new UpdateAccessTokenRepository();
    } else if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT) {
      this.sut = new UpdateAccessTokenRepository({});
    } else if (
      type === UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT
    ) {
      this.sut = new UpdateAccessTokenRepository({ userModel: {} });
    } else {
      this.sut = new UpdateAccessTokenRepository({ userModel: this.userModel });
    }

    return {
      sut: this.sut,
      userModel: this.userModel,
    };
  }
};
