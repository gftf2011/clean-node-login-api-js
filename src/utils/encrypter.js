const bcrypt = require('bcrypt')

module.exports = class Encrypter {
  async compare (password, hashedPassword) {
    const isValid = await bcrypt.compare(password, hashedPassword)
    return isValid
  }
}
