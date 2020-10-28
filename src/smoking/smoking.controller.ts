import { Router, Request, Response, NextFunction } from 'express';
import IController from '../interfaces/controller.interface';
import smokingModel from './smoking.model';
import authMiddleware from '../middlewares/auth.middleware';
import IRequestWithRange from 'interfaces/requestWithRange.interface';
import IRequestWithUser from 'interfaces/requestWithUser.interface';

class Smoking implements IController {
  public router = Router();
  private path = '/api/smokings'
  private smoking = smokingModel;

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.use(this.path, authMiddleware());
    this.router.get(this.path, this.getSmokingsInRange.bind(this));
    this.router.post(this.path, this.recordSmoking.bind(this));
  }

  private async getLastSmoking(req: Request, res: Response, next: NextFunction) {
      const reqWithUser = req as IRequestWithUser;
      const { userId } = reqWithUser;
      const response = await this.smoking.find({ userId }).sort({ timestamp: -1 }).limit(1);
      const { timestamp, _id } = response[0];
      res.send({
          timestamp,
          _id,
      });
  }

  private async getSmokingsInRange(req: Request, res: Response, next: NextFunction) {
    const reqWithRange = req as IRequestWithRange;
    const { rangeStart, rangeEnd } = reqWithRange.body;
    console.log(reqWithRange.userId);
    const smokings = await this.smoking.find({
      userId: reqWithRange.userId,
      timestamp: {
        $gte: rangeStart,
        $lte: rangeEnd,
      }
    });
    res.send(smokings.map(({ _id, timestamp }) => ({
      _id,
      timestamp,
    })));
  }

  private async recordSmoking(req: Request, res: Response, next: NextFunction) {
    const reqWithUser = req as IRequestWithUser;
    const { timestamp } = reqWithUser.body;
    const { userId } = reqWithUser;
    console.log(timestamp);
    console.log(userId);
    const newSmoking = new this.smoking({
      userId,
      timestamp
    });
    newSmoking.save();
  }
}

export default Smoking;