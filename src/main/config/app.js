const express = require('express')
const app = express()

const setup = require('./setup')

setup(app)

module.exports = app
