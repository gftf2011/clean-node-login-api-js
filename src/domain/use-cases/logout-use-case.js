const MissingParamError = require('../../utils/errors/missing-param-error');
const ServerError = require('../../utils/errors/server-error');

module.exports = class LogOutUseCase {
  constructor({ loadUserByIdRepository, updateAccessTokenRepository } = {}) {
    this.loadUserByIdRepository = loadUserByIdRepository;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async execute(userId) {
    if (
      !this.loadUserByIdRepository ||
      !this.loadUserByIdRepository.load ||
      !this.updateAccessTokenRepository ||
      !this.updateAccessTokenRepository.update
    ) {
      throw new ServerError();
    }
    if (!userId) {
      throw new MissingParamError('userId');
    }
    const user = await this.loadUserByIdRepository.load(userId);
    if (!user) {
      return false;
    }
    await this.updateAccessTokenRepository.update(userId, null);
    return true;
  }
};
