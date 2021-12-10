const helmet = require('helmet');

module.exports = app => {
  app.use(helmet());
};
