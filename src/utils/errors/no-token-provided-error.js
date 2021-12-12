module.exports = class NoTokenProvidedError extends Error {
  constructor() {
    super('Authorization token not provided');
    this.name = 'NoTokenProvidedError';
  }
};
