const { ERR_FORBIDDEN } = require('../const/errors');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_FORBIDDEN;
  }
}

module.exports = ForbiddenError;
