const dotEnv = require("dotenv");
const result = dotEnv.config();

if (result.error) {
  console.warn(
    ".env file not found, falling back to Vercel environment variables"
  );
}

const db =
  process.env.NODE_ENV === "development"
    ? process.env.DB_DEV_URL
    : process.env.DB_PROD_URL;

const port = process.env.PORT ?? 3000;
const saltRounds = process.env.SALT_ROUNDS;
const secretKey = process.env.SECRET_KEY;

if (!db || !port || !saltRounds || !secretKey) {
  throw new Error("Required environment variables are missing.");
}

module.exports = { db, port, saltRounds, secretKey };
