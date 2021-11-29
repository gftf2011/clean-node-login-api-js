const InsertUserRepositorySpy = require('../../../../../spies/insert-user-repository-spy');

module.exports = class InsertUserRepositorySpyFactory {
  create() {
    this.insertUserRepositorySpy = new InsertUserRepositorySpy();
    return this.insertUserRepositorySpy;
  }
};
