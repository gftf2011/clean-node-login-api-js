module.exports = class InsertUserRepositorySpy {
  async insert(user) {
    this.user = user;
    return this.userId;
  }
};
