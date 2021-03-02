const { cleanEnv, str, port } = require('envalid');

function getValidatedEnvVars() {
  return cleanEnv(process.env, {
    PORT: port(),
    MONGO_USER: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    FIREBASE_KEY: str(),
    FIREBASE_EMAIL: str(),
    FIREBASE_PROJECT_ID: str(),
  });
}

module.exports = getValidatedEnvVars;