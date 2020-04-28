import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../user/user.model'
import IDataStoredInToken from '../auth/dataStoredInToken.interface';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import WrongTokenException from '../exceptions/wrongTokenException';
import MissingTokenException from '../exceptions/missingTokenException';

function authMiddleware(secret: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      try {
        const token = authorization.slice(7, authorization.length)
        const verificationResponse = jwt.verify(token, secret) as IDataStoredInToken;
        const id = verificationResponse._id;
        const user = await userModel.findById(id);
        
        if (user) {
          const reqWithUser = req as IRequestWithUser;
          reqWithUser.user = user;
          next();
        } else {
          next(new WrongTokenException())
        }
      } catch(err) {
        next(new WrongTokenException())
      }
    } else {
      next(new MissingTokenException())
    }
  }
}

export default authMiddleware;