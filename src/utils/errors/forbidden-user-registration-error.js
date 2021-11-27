module.exports = class ForbiddenUserRegistrationError extends Error {
  constructor() {
    super('User already exists and cannot sign up again');
    this.name = 'ForbiddenUserRegistrationError';
  }
};
