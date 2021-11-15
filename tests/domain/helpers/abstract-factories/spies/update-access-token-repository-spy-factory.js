const UpdateAccessTokenRepositorySpy = require('../../../../../spies/update-access-token-repository-spy')

module.exports = class UpdateAccessTokenRepositorySpyFactory {
  create () {
    this.updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()
    return this.updateAccessTokenRepositorySpy
  }
}
