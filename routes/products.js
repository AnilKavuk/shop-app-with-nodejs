const express = require("express");
const router = express.Router();

const { Product, validateProduct } = require("../models/product");
const { Comment } = require("../models/comment");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/", async (req, res) => {
  const products = await Product.find({ isActive: true })
    .populate("category", "name -_id")
    .select("-isActive -_id -comments._id");
  res.send(products);
});

router.post("/", [auth, isAdmin], async (req, res) => {
  const { error } = validateProduct(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    isActive: req.body.isActive,
    category: req.body.category,
    comments: req.body.comments,
  });

  const newProduct = await product.save();
  res.send(newProduct);
});

router.put("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).send("The product you are looking for was not found.");
    return;
  }
  const { error } = validateProduct(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  product.name = req.body.name;
  product.price = req.body.price;
  product.description = req.body.description;
  product.imageUrl = req.body.imageUrl;
  product.isActive = req.body.isActive;
  product.category = req.body.category;
  const updatedProduct = await product.save();
  res.send(updatedProduct);
});

router.delete("/:id", async (req, res) => {
  let product = null;
  if (req.params.id.length === 24) {
    product = await Product.findByIdAndDelete(req.params.id);
  }

  if (!product) {
    res.status(404).send("The product you are looking for was not found.");
    return;
  }

  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name -_id"
  );

  if (!product) {
    res.status(404).send("The product you are looking for was not found.");
  }
  res.send(product);
});

router.put("/comment/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).send("The product you are looking for was not found.");
    return;
  }

  const comment = new Comment({
    text: req.body.text,
    username: req.body.username,
  });

  product.comments.push(comment);

  const updatedProduct = await product.save();

  res.send(updatedProduct);
});

router.delete("/comment/:id", async (req, res) => {
  let product = null;

  if (req.params.id.length === 24) {
    product = await Product.findById(req.params.id);
  }

  const comment = product.comments.id(req.body.commentId);

  if (comment) {
    comment.remove();
  } else {
    res.status(404).send("There are no comments you wish to delete.");
    return;
  }

  const updatedProduct = await product.save();

  if (!product) {
    res.status(404).send("The product you are looking for was not found.");
    return;
  }

  res.send(updatedProduct);
});

module.exports = router;
