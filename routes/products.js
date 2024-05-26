const express = require("express");
const router = express.Router();

const { Product, validateProduct } = require("../models/product");

const products = [
  {
    id: 1,
    name: "Iphone 12",
    price: 20000,
  },
  {
    id: 2,
    name: "Iphone 13",
    price: 30000,
  },
  {
    id: 3,
    name: "Iphone 14",
    price: 40000,
  },
];

router.get("/", async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.send(products);
});

router.post("/", (req, res) => {
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
  });

  const result = saveProduct(product);

  if (result) {
    products.push(product);
    res.send(product);
  } else {
    products.push(product);
    res.send(product);
  }
});

router.put("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404).send("aradığınız ürün bulunamadı.");
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
  const updatedProduct = await product.save();
  res.send(updatedProduct);
});

router.delete("/:id", async (req, res) => {
  let product = null;
  if (req.params.id.length === 24) {
    product = await Product.findByIdAndDelete(req.params.id);
  }

  if (!product) {
    res.status(404).send("aradığınız ürün bulunamadı.");
    return;
  }

  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404).send("aradığınız ürün bulunamadı");
  }
  res.send(product);
});

async function saveProduct(product) {
  try {
    const result = await product.save();
    console.log(result);
    return result;
  } catch (err) {
    console.log("err: ", err);
  }
}

module.exports = router;
