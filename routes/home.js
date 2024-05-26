const express = require("express");
const { Product } = require("../models/product");
const router = express.Router();

router.get("/", async (req, res) => {
  const product = await Product.find();
  res.send(product[0]);
});

module.exports = router;
