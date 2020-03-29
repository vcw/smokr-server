import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '../user/user.model'
import IDataStoredInToken from '../auth/dataStoredInToken.interface';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import WrongTokenException from '../exceptions/wrongTokenException';
import MissingTokenException from '../exceptions/missingTokenException';

function authMiddleware(secret: string) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    if (cookies && cookies.Authorization) {
      try {
        const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredInToken;
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