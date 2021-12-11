const ExpressBruteRedisStoreAdapter = require('../adapters/express-brute-redis-store-adapter');

module.exports = app => {
  app.use(
    process.env.BRUTE_ON === 'true'
      ? ExpressBruteRedisStoreAdapter.adapter()
      : (_req, _res, next) => {
          next();
        },
  );
};
