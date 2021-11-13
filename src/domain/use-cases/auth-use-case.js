const MissingParamError = require('../../utils/errors/missing-param-error')
const ServerError = require('../../utils/errors/server-error')

module.exports = class AuthUseCase {
  constructor ({ loadUserByEmailRepository, encrypter, tokenGenerator } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async execute (email, password) {
    if (
      !this.loadUserByEmailRepository ||
      !this.loadUserByEmailRepository.load ||
      !this.encrypter ||
      !this.encrypter.compare ||
      !this.tokenGenerator ||
      !this.tokenGenerator.generate
    ) {
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
    return await this.tokenGenerator.generate(user.id)
  }
}
