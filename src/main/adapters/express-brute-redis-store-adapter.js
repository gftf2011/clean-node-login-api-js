const RedisStore = require('express-brute-redis');
const ExpressBrute = require('express-brute');

module.exports = class ExpressBruteRedisStoreAdapter {
  static adapter() {
    const store = new RedisStore({
      host: process.env.REDIS_CLIENT_HOST,
      port: parseInt(process.env.REDIS_CLIENT_PORT, 10),
    });
    const bruteForce = new ExpressBrute(store, {
      freeRetries: 3,
      minWait: 1000,
    });
    return bruteForce.prevent;
  }
};
