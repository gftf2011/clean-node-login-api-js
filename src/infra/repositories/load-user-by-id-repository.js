const MissingParamError = require('../../utils/errors/missing-param-error');
const ServerError = require('../../utils/errors/server-error');

module.exports = class LoadUserByIdRepository {
  constructor({ userModel } = {}) {
    this.userModel = userModel;
  }

  async load(id) {
    if (!this.userModel || !this.userModel.findOne) {
      throw new ServerError();
    } else if (!id) {
      throw new MissingParamError('id');
    }
    const user = await this.userModel.findOne({ _id: id });
    return user;
  }
};
