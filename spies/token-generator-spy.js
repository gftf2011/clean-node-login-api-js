module.exports = class TokenGeneratorSpy {
  async generate(userId) {
    this.userId = userId;
    return this.accessToken;
  }
};
