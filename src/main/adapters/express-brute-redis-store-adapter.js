const RedisStore = require('express-brute-redis');
const ExpressBrute = require('express-brute');
const { REDIS_CLIENT_HOST, REDIS_CLIENT_PORT } = require('../config/env');

module.exports = class ExpressBruteRedisStoreAdapter {
  static adapter() {
    const store = new RedisStore({
      host: REDIS_CLIENT_HOST,
      port: REDIS_CLIENT_PORT,
    });
    const bruteForce = new ExpressBrute(store, {
      freeRetries: 3,
      minWait: 1000,
    });
    return bruteForce.prevent;
  }
};
