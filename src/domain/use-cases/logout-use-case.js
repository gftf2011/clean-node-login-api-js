module.exports = class LogOutUseCase {
  constructor({ loadUserByIdRepository, updateAccessTokenRepository } = {}) {
    this.loadUserByIdRepository = loadUserByIdRepository;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async execute(userId) {
    const user = await this.loadUserByIdRepository.load(userId);
    if (!user) {
      return false;
    }
    await this.updateAccessTokenRepository.update(userId, null);
    return true;
  }
};
