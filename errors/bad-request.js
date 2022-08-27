const { ERR_BAD_REQUEST } = require('../const/errors');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERR_BAD_REQUEST;
  }
}

module.exports = BadRequest;
