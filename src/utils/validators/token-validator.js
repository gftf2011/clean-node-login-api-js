const jwt = require('jsonwebtoken');

module.exports = class TokenValidator {
  retrieveUserId(auth) {
    const [, token] = auth.split(' ');
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      return decoded._id;
    } catch (_err) {
      return null;
    }
  }
};
