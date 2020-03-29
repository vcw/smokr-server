import HttpException from "./httpException";

class InvalidDateException extends HttpException {
  constructor() {
    super(400, 'Date is invalid');
  }
}

export default InvalidDateException;