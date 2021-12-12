module.exports = class NoUserFoundError extends Error {
  constructor() {
    super('No user was found');
    this.name = 'NoUserFoundError';
  }
};
