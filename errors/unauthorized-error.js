const { ERR_UNAUTHORIZED } = require('../const/errors');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
