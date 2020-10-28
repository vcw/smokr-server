import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorMiddleware from './middlewares/error.middleware';
import IController from './interfaces/controller.interface';
import IMongoCredentials from './interfaces/mongoCredentials.interface';
import admin from 'firebase-admin';

class App {
  public app = express();

  constructor(
    private controllers: Array<IController>,
    private mongoCredentials: IMongoCredentials,
    private firebaseCredentials: any,
    public port: number
    ) {
    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
    this.initializeFirebase();
    this.connectToDB();
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors({
      origin: true,
      credentials: true,
      allowedHeaders: '*',
    }));
  }

  private initializeControllers() {
    this.controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeFirebase() {
    const creds = this.firebaseCredentials;
    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: creds.key.replace(/\\n/g, '\n'),
        clientEmail: creds.email,
        projectId: creds.projectId,
      })
    })
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App is listening on the port ${this.port}`);
    });
  }

  public connectToDB() {
    const { user, password, path } = this.mongoCredentials;
    mongoose.connect(`mongodb+srv://${user}:${password}@${path}/smokrapp`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  }
}

export default App;