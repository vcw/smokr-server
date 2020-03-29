import 'dotenv/config';
import App from './App';
import getValidatedEnvVars from './utils/validateEnv';
import Auth from './auth/auth.controller';
import User from './user/user.controller';
import Smoke from './smoke/smoke.controller';

const env = getValidatedEnvVars();

const {
  PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_PATH,
  JWT_SECRET
} = env;


const app = new App(
  [
    new Auth(JWT_SECRET),
    new User(JWT_SECRET),
    new Smoke(JWT_SECRET)
  ],
  {
    user: MONGO_USER,
    password: MONGO_PASSWORD,
    path: MONGO_PATH
  },
  PORT
);

app.listen();
