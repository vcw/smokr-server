const { Router } = require('express');
const smokingModel = require('./smoking.model');
const authMiddleware = require('../middlewares/auth.middleware');

class Smoking {
  router = Router();
  path = '/api/smokings'
  smoking = smokingModel;

  constructor() {
    this.initializeRoutes()
  }

  initializeRoutes() {
    this.router.use(this.path, authMiddleware());
    this.router.get(this.path, this.getSmokingsInRange.bind(this));
    this.router.get(this.path + '/last', this.getLastSmoking.bind(this));
    this.router.post(this.path, this.recordSmoking.bind(this));
  }

  async getLastSmoking(req, res, next) {
    try {
      const { userId } = req;
      const response = await this.smoking.find({ userId })
        .sort({ timestamp: -1 })
        .limit(1);
      const { timestamp, _id } = response[0];
      res.send({
          timestamp,
          _id,
      });
    } catch (error) {
      res.send({
        'Error': 'Smoking not found'
      });
    }
  }

  async getSmokingsInRange(req, res, next) {
    const { rangeStart, rangeEnd } = req.body;
    const smokings = await this.smoking.find({
      userId: req.userId,
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

  async recordSmoking(req, res, next) {
    try {
      const { timestamp } = req.body;
      const { userId } = req;
      const newSmoking = new this.smoking({
        userId,
        timestamp
      });
      newSmoking.save();
      res.send({
        status: 'Success',
      });
    } catch (error) {
      res.send({
        status: 'Fail',
      });
    }
  }
}

module.exports = Smoking;