const LoadUserByEmailRepositorySpy = require('../../../../../spies/load-user-by-email-repository-spy');

const {
  FAKE_HASHED_PASSWORD,
  FAKE_GENERIC_USER_ID,
} = require('../../constants');

module.exports = class LoadUserByEmailRepositorySpyFactory {
  create() {
    this.loadUserByEmailRepositorySpy = new LoadUserByEmailRepositorySpy();
    this.loadUserByEmailRepositorySpy.user = {
      id: FAKE_GENERIC_USER_ID,
      password: FAKE_HASHED_PASSWORD,
    };
    return this.loadUserByEmailRepositorySpy;
  }
};
