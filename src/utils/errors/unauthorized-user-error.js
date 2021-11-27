module.exports = class UnauthorizedUserError extends Error {
  constructor() {
    super('User is not authorized');
    this.name = 'UnauthorizedUserError';
  }
};
