module.exports = class LogOutUseCaseSpy {
  async execute(userId) {
    this.userId = userId;
    return this.isLoggedOut;
  }
};
