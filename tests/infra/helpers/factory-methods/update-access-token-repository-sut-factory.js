const UpdateAccessTokenRepository = require('../../../../src/infra/repositories/update-access-token-repository')

const {
  UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_OBJECT_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_EMPTY_USER_MODEL_OBJECT_SUT
} = require('../constants')

module.exports = class SutFactory {
  constructor (db) {
    this.db = db
  }

  create (type) {
    this.userModel = this.db.collection('users')

    if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_SUT) {
      this.sut = new UpdateAccessTokenRepository()
    } else if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_OBJECT_SUT) {
      this.sut = new UpdateAccessTokenRepository({})
    } else if (type === UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_EMPTY_USER_MODEL_OBJECT_SUT) {
      this.sut = new UpdateAccessTokenRepository({ userModel: {} })
    } else {
      this.sut = new UpdateAccessTokenRepository({ userModel: this.userModel })
    }

    return {
      sut: this.sut,
      userModel: this.userModel
    }
  }
}
