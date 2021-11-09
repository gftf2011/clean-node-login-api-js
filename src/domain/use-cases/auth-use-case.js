const MissingParamError = require('../../utils/errors/missing-param-error')
const ServerError = require('../../utils/errors/server-error')

module.exports = class AuthUseCase {
  constructor (loadUserByEmailRepository) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
  }

  async execute (email, password) {
    if (!this.loadUserByEmailRepository || !this.loadUserByEmailRepository.load) {
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
    return null
  }
}
