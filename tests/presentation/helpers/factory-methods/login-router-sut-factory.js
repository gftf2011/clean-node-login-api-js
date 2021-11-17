const LoginRouter = require('../../../../src/presentation/routers/login-router')

const MissingParamError = require('../../../../src/utils/errors/missing-param-error')
const ServerError = require('../../../../src/utils/errors/server-error')
const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb')

const DependenciesFactory = require('../abstract-factories/login-router-dependencies-factory')

const {
  AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT,
  AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT,
  AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT,
  AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT,
  AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT,
  EMAIL_VALIDATOR_THROWING_ERROR_SUT
} = require('../constants')

module.exports = class SutFactory {
  create (type) {
    this.dependencies = new DependenciesFactory().create()

    if (type === AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT) {
      this.dependencies.authUseCaseSpy.execute = async (email) => {
        this.dependencies.authUseCaseSpy.email = email
        throw new MissingParamError('password')
      }
    } else if (type === AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT) {
      this.dependencies.authUseCaseSpy.execute = async () => {
        throw new MissingParamError('email')
      }
    } else if (type === AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT) {
      this.dependencies.authUseCaseSpy.execute = async () => {
        throw new ServerError()
      }
    } else if (type === EMAIL_VALIDATOR_THROWING_ERROR_SUT) {
      this.dependencies.emailValidatorSpy.isValid = (_email) => {
        throw new ServerError()
      }
    } else if (type === AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT) {
      this.dependencies.authUseCaseSpy.execute = async () => {
        throw new MongoNotConnectedError('Not possible to connect to MongoDB Driver')
      }
    } else if (type === AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT) {
      this.dependencies.authUseCaseSpy.execute = async () => {
        throw new MongoServerClosedError('Not possible to close MongoDB Driver')
      }
    }

    this.sut = new LoginRouter({
      authUseCase: this.dependencies.authUseCaseSpy,
      emailValidator: this.dependencies.emailValidatorSpy
    })

    return {
      sut: this.sut,
      ...this.dependencies
    }
  }
}
