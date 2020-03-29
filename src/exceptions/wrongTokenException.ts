import HttpException from "./httpException";

class WrongTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong authentication token')
  }
}

export default WrongTokenException;