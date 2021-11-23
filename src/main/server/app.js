const express = require('express');

const app = express();

const setup = require('../config/setup');
const routes = require('../config/routes');

setup(app);
routes(app);

module.exports = app;
