const bcrypt = require('bcrypt')

const MissingParamError = require('./errors/missing-param-error')

module.exports = class Encrypter {
  async compare (value, hashValue) {
    if (!value) {
      throw new MissingParamError('value')
    } else if (!hashValue) {
      throw new MissingParamError('hashValue')
    }
    const isValid = await bcrypt.compare(value, hashValue)
    return isValid
  }
}
