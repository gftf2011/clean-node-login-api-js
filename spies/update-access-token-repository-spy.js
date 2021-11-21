module.exports = class UpdateAccessTokenRepositorySpy {
  async update(userId, accessToken) {
    this.userId = userId;
    this.accessToken = accessToken;
  }
};
