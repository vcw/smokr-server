const HttpException = require("./httpException");

class WrongTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong authentication token')
  }
}

module.exports = WrongTokenException;