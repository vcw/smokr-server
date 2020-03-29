import { Router, Request, Response, NextFunction } from 'express'
import { DateTime } from 'luxon';
import authMiddleware from '../middlewares/auth.middleware'
import IController from '../interfaces/controller.interface'
import smokeModel from './smoke.model';
import IRequestWithUser from 'interfaces/requestWithUser.interface';
import InvalidDateException from '../exceptions/invalidDateException';

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
    try {
      const date = DateTime.fromISO(reqWithUser.body.date, { setZone: true });
      if (date.isValid) {
        const smoke = await this.smoke.create({
          userId: user._id,
          date: date
        });
        res.send({
          id: smoke._id,
          date: smoke.date
        });
      } else {
        next(new InvalidDateException())
      }
    } catch (err) {
      next(new InvalidDateException());
    }
  }

  deleteSmoke() {}
}

export default Smoke;