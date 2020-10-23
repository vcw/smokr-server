import { Request } from 'express';

interface IRequestWithUser extends Request {
  userId: string;
}

export default IRequestWithUser;