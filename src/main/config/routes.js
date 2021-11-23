/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const router = require('express').Router();
const fg = require('fast-glob');

module.exports = app => {
  app.use('/api', router);

  fg.sync('**/src/main/routes/**/*route.js').forEach(file =>
    require(`../../../${file}`)(router),
  );
};
