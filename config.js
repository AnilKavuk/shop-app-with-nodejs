const dotEnv = require("dotenv");
const result = dotEnv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

let db = null;
if (process.env.NODE_ENV === "development") {
  db = envs.DB_DEV_URL;
} else if (process.env.NODE_ENV === "production") {
  db = envs.DB_PROD_URL;
}

const port = envs.PORT ?? 3000;

const saltRounds = envs.SALT_ROUNDS;

const secretKey = envs.SECRET_KEY;

module.exports = { db, port, saltRounds, secretKey };
