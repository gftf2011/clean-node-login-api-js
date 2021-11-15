const ServerError = require('../../../src/utils/errors/server-error')

module.exports = class LoadUserByEmailRepository {
  constructor ({ userModel } = {}) {
    this.userModel = userModel
  }

  async load (email) {
    if (!this.userModel || !this.userModel.findOne) {
      throw new ServerError()
    }
    const user = await this.userModel.findOne({ email })
    return user
  }
}
