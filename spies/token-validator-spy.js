module.exports = class TokenValidatorSpy {
  async retrieveUserId(token) {
    this.token = token;
    return this.userId;
  }
};
