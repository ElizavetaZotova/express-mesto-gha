const { ERR_NOT_FOUND } = require('../const/errors');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_NOT_FOUND;
  }
}

module.exports = NotFound;
