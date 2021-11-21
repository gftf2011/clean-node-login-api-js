module.exports = {
  token: null,
  sign(payload, secret) {
    this.payload = payload;
    this.secret = secret;
    return this.token;
  },
};
