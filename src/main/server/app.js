const express = require('express')
const app = express()

const setup = require('../config/setup')

setup(app)

module.exports = app
