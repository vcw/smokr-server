import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import MissingTokenException from '../exceptions/missingTokenException';
import WrongTokenException from '../exceptions/wrongTokenException';

function authMiddleware() {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.slice(7, authorization.length);

      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const id = decodedToken.uid;
        
        const reqWithUser = req as IRequestWithUser;
        reqWithUser.userId = id;
        next();
      } catch (error) {
        console.log(error)
        next(new WrongTokenException());
      }
    } else {
      next(new MissingTokenException());
    }
  }
}

export default authMiddleware;