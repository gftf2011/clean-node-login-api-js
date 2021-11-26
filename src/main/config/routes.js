/* eslint-disable global-require */
const router = require('express').Router();
const { sync } = require('fast-glob');

module.exports = app => {
  app.use('/api', router);
  sync('**/src/main/routes/**/*routes.js').forEach(file => {
    require(`../../../${file}`)(router);
  });
};
