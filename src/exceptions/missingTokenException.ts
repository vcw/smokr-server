import HttpException from "./httpException";

class MissingTokenException extends HttpException {
  constructor() {
    super(401, 'Authentication token missing');
  }
}

export default MissingTokenException;