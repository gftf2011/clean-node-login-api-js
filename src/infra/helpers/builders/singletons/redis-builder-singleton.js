const RedisBuilder = require('../redis-builder');

module.exports = {
  createInstance() {
    this.instance = new RedisBuilder();
    return this.instance;
  },

  getInstance() {
    if (!this.instance) {
      this.instance = this.createInstance();
    }
    return this.instance;
  },
};
