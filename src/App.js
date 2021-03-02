const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');
const admin = require('firebase-admin');

class App {
  app = express();

  constructor(
    controllers,
    mongoCredentials,
    firebaseCredentials,
    port
    ) {
    this.controllers = controllers;
    this.mongoCredentials = mongoCredentials;
    this.firebaseCredentials = firebaseCredentials;
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers();
    this.initializeErrorHandling();
    this.initializeFirebase();
    this.connectToDB();
  }

  initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors({
      origin: true,
      credentials: true,
      allowedHeaders: '*',
    }));
  }

  initializeControllers() {
    this.controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  initializeFirebase() {
    const creds = this.firebaseCredentials;
    admin.initializeApp({
      credential: admin.credential.cert({
        privateKey: creds.key.replace(/\\n/g, '\n'),
        clientEmail: creds.email,
        projectId: creds.projectId,
      })
    })
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App is listening on the port ${this.port}`);
    });
  }

  connectToDB() {
    const { user, password, path } = this.mongoCredentials;
    mongoose.connect(`mongodb+srv://${user}:${password}@${path}/smokrapp`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
  }
}

module.exports = App;