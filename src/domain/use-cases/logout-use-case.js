module.exports = class LogOutUseCase {
  constructor({ loadUserByIdRepository } = {}) {
    this.loadUserByIdRepository = loadUserByIdRepository;
  }

  // eslint-disable-next-line consistent-return
  async execute(userId) {
    const user = await this.loadUserByIdRepository.load(userId);
    if (!user) {
      return false;
    }
  }
};
