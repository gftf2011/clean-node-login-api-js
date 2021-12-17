module.exports = class TokenValidatorSpy {
  retrieveUserId(token) {
    this.token = token;
    return this.userId;
  }
};
