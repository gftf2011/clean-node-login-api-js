const redis = require('redis');

module.exports = class RedisBuilder {
  constructor(host, port) {
    this.host = host;
    this.port = port;
  }

  setClient() {
    this.client = redis.createClient({
      host: this.host,
      port: this.port,
    });
  }

  getProduct() {
    const result = {
      client: this.client,
    };
    return result;
  }
};
