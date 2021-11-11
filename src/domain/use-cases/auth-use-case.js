const MissingParamError = require('../../utils/errors/missing-param-error')
const ServerError = require('../../utils/errors/server-error')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository, encrypter) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
  }

  async execute (email, password) {
    if (!this.loadUserByEmailRepository || !this.loadUserByEmailRepository.load || !this.encrypter || !this.encrypter.compare) {
      throw new ServerError()
    } else if (!email) {
      throw new MissingParamError('email')
    } else if (!password) {
      throw new MissingParamError('password')
    }
    const user = await this.loadUserByEmailRepository.load(email)
    if (!user) {
      return null
    }
    const isValid = await this.encrypter.compare(password, user.password)
    if (!isValid) {
      return null
    }
  }
}