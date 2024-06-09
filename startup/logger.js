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
    new transports.File({
      filename: "logs/logs.log",
      level: "error",
      maxFiles: "3d",
    }),
    new transports.File({
      filename: "logs/exceptions.log",
      level: "error",
      handleExceptions: true,
      handleRejections: true,
      maxFiles: "3d",
    }),
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

process.on("uncaughtException", (error) => {
  console.log(error.message);
  logger.error(error.message);
});

process.on("unhandledRejection", (error) => {
  console.log(error.message);
  logger.error(error.message);
});

module.exports = logger;
