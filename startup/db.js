const mongoose = require("mongoose");
const { db } = require("../config");
const logger = require("./logger");

module.exports = (async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(db);
    logger.info("mongodb bağlantısı kuruldu.");
  } catch (err) {
    logger.info(err);
  }
})();
