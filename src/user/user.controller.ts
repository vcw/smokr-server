import { Router, Request, Response, NextFunction } from 'express';
import IRequestWithUser from '../interfaces/requestWithUser.interface';
import IController from '../interfaces/controller.interface';
import userModel from './user.model';
import authMiddleware from '../middlewares/auth.middleware';

class User implements IController {
  public router = Router();
  private path = '/api/user'

  constructor(private secret: string) {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(authMiddleware(this.secret));
    this.router.get(this.path, this.getInfo);
    this.router.patch(this.path, this.changeName);
  }

  getInfo(req: Request, res: Response, next: NextFunction) {
    const reqWithUser = req as IRequestWithUser;
    const user = reqWithUser.user;
    res.send({
      username: user.username,
      name: user.name
    });
  }

  changeName(req: Request, res: Response, next: NextFunction) {
    const reqWithUser = req as IRequestWithUser;
    const user = reqWithUser.user;
    user.name = req.body.name;
    user.save();
    res.send({
      username: user.username,
      name: user.name
    });
  }
}

export default User;