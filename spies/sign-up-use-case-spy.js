module.exports = class SignUpUseCaseSpy {
  async execute(user) {
    this.email = user.email;
    this.password = user.password;
    this.name = user.name;
    this.cpf = user.cpf;
    return this.accessToken;
  }
};
