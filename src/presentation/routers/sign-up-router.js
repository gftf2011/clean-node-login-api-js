const HttpResponse = require('../helpers/http-response');

const MissingParamError = require('../../utils/errors/missing-param-error');
const InvalidParamError = require('../../utils/errors/invalid-param-error');
const ServerError = require('../../utils/errors/server-error');

module.exports = class SignUpRouter {
  constructor({ emailValidator, cpfValidator, signUpUseCase } = {}) {
    this.emailValidator = emailValidator;
    this.cpfValidator = cpfValidator;
    this.signUpUseCase = signUpUseCase;
  }

  async route(httpRequest) {
    try {
      const { email, password, cpf, name } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'));
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'));
      }
      if (!cpf) {
        return HttpResponse.badRequest(new MissingParamError('cpf'));
      }
      if (!this.cpfValidator.isValid(cpf)) {
        return HttpResponse.badRequest(new InvalidParamError('cpf'));
      }
      if (!name) {
        return HttpResponse.badRequest(new MissingParamError('name'));
      }
      const user = {
        email,
        password,
        cpf,
        name,
      };
      // accessToken is temporary, will be replaced by an object of existent User in the database
      const accessToken = await this.signUpUseCase.execute(user);
      if (!accessToken) {
        return HttpResponse.forbiddenUserRegistrationError();
      }
      return HttpResponse.success({ accessToken });
    } catch (error) {
      return HttpResponse.serverError(new ServerError());
    }
  }
};
