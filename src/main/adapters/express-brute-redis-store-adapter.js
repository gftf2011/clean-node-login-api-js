const RedisStore = require('express-brute-redis');
const ExpressBrute = require('express-brute');
const RedisHelper = require('../../infra/helpers/redis-helper');

module.exports = class ExpressBruteRedisStoreAdapter {
  static adapter() {
    RedisHelper.setClient(
      process.env.REDIS_CLIENT_HOST,
      process.env.REDIS_CLIENT_PORT,
    );
    const client = RedisHelper.getClient();
    const store = new RedisStore({
      client,
    });
    const bruteForce = new ExpressBrute(store, {
      freeRetries: parseInt(process.env.BRUTE_FREE_RETRIES, 10),
      minWait: parseInt(process.env.BRUTE_MIN_WAIT, 10),
    });
    return bruteForce.prevent;
  }
};
