const express = require("express");
const app = express();

const { port } = require("./config");

require("./startup/logger");
require("./startup/routes")(app);
require("./startup/db");
if (process.env.NODE_ENV === "production") {
  require("./startup/production")(app);
}

app.listen(port, () => {
  console.log("listening port " + port);
});
