const { transports, createLogger, format } = require("winston");
const { db } = require("../config");
const { combine, timestamp, prettyPrint } = format;

require("winston-mongodb");

const logger = createLogger({
  format: combine(
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    prettyPrint()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs.log", level: "error" }),
    new transports.MongoDB({
      level: "error",
      db: db,
      options: {
        useUnifiedTopology: true,
      },
      collection: "server_logs",
    }),
  ],
});

module.exports = logger;
