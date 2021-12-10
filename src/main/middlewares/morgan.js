const morgan = require('morgan');

module.exports = app => {
  app.use(
    process.env.LOGGER_ON === 'true'
      ? morgan('dev', {
          skip: (_req, _res) => process.env.LOGGER_SKIP === 'true',
        })
      : (_req, _res, next) => {
          next();
        },
  );
};
