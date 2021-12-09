const ServerError = require('../../utils/errors/server-error');
const MissingParamError = require('../../utils/errors/missing-param-error');

module.exports = class InsertUserRepository {
  constructor({ userModel } = {}) {
    this.userModel = userModel;
  }

  async insert(user) {
    if (!this.userModel || !this.userModel.insertOne) {
      throw new ServerError();
    } else if (!user) {
      throw new MissingParamError('user');
    }
    const insertedUser = await this.userModel.insertOne(user);
    return insertedUser.insertedId;
  }
};
