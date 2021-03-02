require('dotenv/config');
const App = require('./App');
const getValidatedEnvVars = require('./utils/validateEnv');
const Smoking = require('./smoking/smoking.controller');

const env = getValidatedEnvVars();

const {
  PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
  FIREBASE_KEY,
  FIREBASE_EMAIL,
  FIREBASE_PROJECT_ID,
} = env;


const app = new App(
  [
    new Smoking(),
  ],
  {
    user: MONGO_USER,
    password: MONGO_PASSWORD,
    path: MONGO_PATH
  },
  {
    key: FIREBASE_KEY,
    email: FIREBASE_EMAIL,
    projectId: FIREBASE_PROJECT_ID
  },
  PORT
);

app.listen();
