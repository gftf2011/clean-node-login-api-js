module.exports = class AuthUseCaseSpy {
  async execute(email, password) {
    this.email = email;
    this.password = password;
    return this.accessToken;
  }
};
