const dotEnv = require("dotenv");
const result = dotEnv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

const db = envs.DB;

const port = envs.PORT ?? 3000;

module.exports = { db, port };
