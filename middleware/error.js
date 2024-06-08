const logger = require("./logger");

module.exports = (err, req, res, next) => {
  //logging
  logger.error(err.message);
  res.status(500).send("Internal server error");
};
