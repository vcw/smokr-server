import { cleanEnv, str, port } from 'envalid';

function getValidatedEnvVars() {
  return cleanEnv(process.env, {
    PORT: port(),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    JWT_SECRET: str()
  });
}

export default getValidatedEnvVars;