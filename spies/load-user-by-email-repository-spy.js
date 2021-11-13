module.exports = class LoadUserByEmailRepositorySpy {
  async load (email) {
    this.email = email
    return this.user
  }
}
