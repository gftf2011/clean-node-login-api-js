const bcrypt = require('bcrypt');

const MissingParamError = require('./errors/missing-param-error');

module.exports = class Encrypter {
  async compare(value, hashValue) {
    if (!value) {
      throw new MissingParamError('value');
    } else if (!hashValue) {
      throw new MissingParamError('hashValue');
    }
    const isValid = await bcrypt.compare(value, hashValue);
    return isValid;
  }

  async hash(value) {
    if (!value) {
      throw new MissingParamError('value');
    }
    const hashValue = await bcrypt.hash(value, 12);
    return hashValue;
  }
};
