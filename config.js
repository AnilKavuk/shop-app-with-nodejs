const dotEnv = require("dotenv");
const result = dotEnv.config();

if (result.error && process.env.NODE_ENV === "development") {
  throw result.error;
}

let db = null;
if (process.env.NODE_ENV === "development") {
  db = process.env.DB_DEV_URL;
} else if (process.env.NODE_ENV === "production") {
  db = process.env.DB_PROD_URL;
}

const port = process.env.PORT ?? 3000;

const saltRounds = process.env.SALT_ROUNDS;

const secretKey = process.env.SECRET_KEY;

module.exports = { db, port, saltRounds, secretKey };
