const express = require("express");
const app = express();

const { port } = require("./config");
const { injectSpeedInsights } = require("@vercel/speed-insights");

require("./startup/logger");
require("./startup/routes")(app);
require("./startup/db");
if (process.env.NODE_ENV === "production") {
  require("./startup/production")(app);
  injectSpeedInsights();
}

app.listen(port, () => {
  console.log("listening port " + port);
});
