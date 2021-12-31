const RedisBuilder = require('../redis-builder');

module.exports = {
  createInstance(host, port) {
    this.instance = new RedisBuilder(host, port);
    return this.instance;
  },

  getInstance(host, port) {
    if (!this.instance) {
      this.instance = this.createInstance(host, port);
    }
    return this.instance;
  },
};
