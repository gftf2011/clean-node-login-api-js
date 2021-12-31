const ExpressRateLimitRedisStoreAdapter = require('../adapters/express-rate-limit-redis-store-adapter');

module.exports = app => {
  app.use(
    process.env.RATE_LIMIT_ON === 'true'
      ? ExpressRateLimitRedisStoreAdapter.adapter()
      : (_req, _res, next) => {
          next();
        },
  );
};
