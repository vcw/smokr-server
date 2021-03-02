const HttpException = require("./httpException");

class MissingTokenException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing');
  }
}

module.exports = MissingTokenException;