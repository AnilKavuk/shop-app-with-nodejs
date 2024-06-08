const dotEnv = require("dotenv");
const result = dotEnv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

const db = envs.DB;

const port = envs.PORT ?? 3000;

const saltRounds = envs.SALT_ROUNDS;

const secretKey = envs.SECRET_KEY;

module.exports = { db, port, saltRounds, secretKey };
