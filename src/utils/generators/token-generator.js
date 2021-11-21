const jwt = require('jsonwebtoken');

const MissingParamError = require('../errors/missing-param-error');
const ServerError = require('../errors/server-error');

module.exports = class TokenGenerator {
  constructor({ secret } = {}) {
    this.secret = secret;
  }

  async generate(id) {
    if (!this.secret) {
      throw new ServerError();
    } else if (!id) {
      throw new MissingParamError('id');
    }
    return jwt.sign(id, this.secret);
  }
};
