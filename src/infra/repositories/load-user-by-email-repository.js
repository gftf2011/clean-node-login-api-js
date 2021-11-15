const ServerError = require('../../../src/utils/errors/server-error')
const MissingParamError = require('../../utils/errors/missing-param-error')

module.exports = class LoadUserByEmailRepository {
  constructor ({ userModel } = {}) {
    this.userModel = userModel
  }

  async load (email) {
    if (!this.userModel || !this.userModel.findOne) {
      throw new ServerError()
    } else if (!email) {
      throw new MissingParamError('email')
    }
    const user = await this.userModel.findOne({ email })
    return user
  }
}
