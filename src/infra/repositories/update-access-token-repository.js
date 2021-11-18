const ServerError = require('../../../src/utils/errors/server-error')
const MissingParamError = require('../../../src/utils/errors/missing-param-error')

module.exports = class UpdateAccessTokenRepository {
  constructor ({ userModel } = {}) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!this.userModel || !this.userModel.updateOne) {
      throw new ServerError()
    } else if (!userId) {
      throw new MissingParamError('userId')
    } else if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    await this.userModel.updateOne({
      _id: userId
    },
    {
      $set: {
        accessToken
      }
    })
  }
}
