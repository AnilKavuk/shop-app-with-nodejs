const products = require("../routes/products");
const home = require("../routes/home");
const categories = require("../routes/categories");
const users = require("../routes/users");
const error = require("../middleware/error");
const express = require("express");
const cors = require("cors");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/products", products);
  app.use("/api/categories", categories);
  app.use("/api/users", users);
  app.use("/", home);
  app.use(error);

  app.use(
    cors({
      origin: "*",
      methods: ["GET"],
    })
  );
};
