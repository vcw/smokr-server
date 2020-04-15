import { Router, Request, Response, NextFunction } from 'express'
import authMiddleware from '../middlewares/auth.middleware'
import IController from '../interfaces/controller.interface'
import smokeModel from './smoke.model';
import IRequestWithUser from 'interfaces/requestWithUser.interface';

class Smoke implements IController {
  public router = Router();
  private path = '/api/smoke'
  private smoke = smokeModel;

  constructor(private secret: string) {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.use(this.path, authMiddleware(this.secret));
    this.router.get(this.path, this.getLastTenSmokes.bind(this));
    this.router.post(this.path, this.doSmoke.bind(this));
  }

  private async getLastTenSmokes(req: Request, res: Response, next: NextFunction) {
    const reqWithUser = req as IRequestWithUser;
    const user = reqWithUser.user;
    const smokes = await this.smoke.find({ userId: user._id }, null, { sort: { date: -1 }, limit: 10 });
    res.send(smokes.map((smoke) => {
      return {
        _id: smoke.id,
        date: smoke.date
      }
    }));
  }

  private async doSmoke(req: Request, res: Response, next: NextFunction) {
    const reqWithUser = req as IRequestWithUser;
    const user = reqWithUser.user;
    const smoke = await this.smoke.create({
      userId: user._id,
      date: new Date
    });
    res.send({
      id: smoke._id,
      date: smoke.date
    });
  }

  deleteSmoke() {}
}

export default Smoke;