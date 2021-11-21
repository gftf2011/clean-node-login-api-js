const MongoBuilder = require('../mongo-builder');

module.exports = {
  createInstance(uri, dbName) {
    this.instance = new MongoBuilder(uri, dbName);
    return this.instance;
  },

  getInstance(uri, dbName) {
    if (!this.instance) {
      this.instance = this.createInstance(uri, dbName);
    }
    return this.instance;
  },
};
