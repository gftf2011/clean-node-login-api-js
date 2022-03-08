const redis = require('redis');

module.exports = class RedisBuilder {
  #product;

  constructor() {
    this.#reset();
  }

  #reset() {
    this.#product = {};
  }

  client(host, port) {
    const client = redis.createClient({
      host,
      port,
    });
    this.#product = { ...this.#product, client };
    return this;
  }

  getProduct() {
    const result = this.#product;
    this.#reset();
    return result;
  }
};
