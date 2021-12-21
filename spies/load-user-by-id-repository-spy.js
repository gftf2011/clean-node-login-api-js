module.exports = class LoadUserByIdRepositorySpy {
  async load(userId) {
    this.userId = userId;
    return this.user;
  }
};
