const logger = require("../startup/logger");

module.exports = (err, req, res, next) => {
  //logging
  logger.error(err.message, err);
  res.status(500).send("Internal server error");
};
