module.exports = class NoError extends Error {
  constructor() {
    super();
    this.name = 'NoError';
  }
};
