import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error.middleware';
import IController from './interfaces/controller.interface';
import IMongoCredentials from './interfaces/mongoCredentials.interface';
import corsMiddleware from './middlewares/cors.middleware';

class App {
  public app = express();

  constructor(private controllers: Array<IController>, private mongoCredentials: IMongoCredentials, public port: number) {
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
    this.connectToDB();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cookieParser());
    this.app.use(corsMiddleware());
  }

  private initializeControllers() {
    this.controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App is listening on the port ${this.port}`);
    });
  }

  public connectToDB() {
    const { user, password, path } = this.mongoCredentials;
    mongoose.connect(`mongodb+srv://${user}:${password}@${path}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  }
}

export default App;