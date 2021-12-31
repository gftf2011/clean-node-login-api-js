const RedisStore = require('express-brute-redis');
const ExpressBrute = require('express-brute');

module.exports = class ExpressBruteRedisStoreAdapter {
  static adapter() {
    const store = new RedisStore({
      host: process.env.REDIS_CLIENT_HOST,
      port: parseInt(process.env.REDIS_CLIENT_PORT, 10),
    });
    const bruteForce = new ExpressBrute(store, {
      freeRetries: parseInt(process.env.BRUTE_FREE_RETRIES, 10),
      minWait: parseInt(process.env.BRUTE_MIN_WAIT, 10),
    });
    return bruteForce.prevent;
  }
};
