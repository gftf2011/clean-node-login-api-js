// eslint-disable-next-line import/no-unresolved
const RateLimit = require('express-rate-limit');
const RateLimitRedis = require('rate-limit-redis');
const RedisHelper = require('../../infra/helpers/redis-helper');

module.exports = class ExpressRateLimitRedisStoreAdapter {
  static adapter() {
    RedisHelper.setClient(
      process.env.REDIS_CLIENT_HOST,
      process.env.REDIS_CLIENT_PORT,
    );
    const client = RedisHelper.getClient();
    const store = new RateLimitRedis({
      client,
    });
    const rateLimit = RateLimit({
      store,
      windowMs: 1000 * 60 * 15,
      max: parseInt(process.env.RATE_LIMIT_MAX_CALLS, 10),
      handler: (_request, response, _next, options) => {
        response.status(options.statusCode).send({
          message: options.message,
        });
      },
    });
    return rateLimit;
  }
};
