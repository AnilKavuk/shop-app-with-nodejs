const express = require("express");
const router = express.Router();

const Joi = require("joi");

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

router.get("/", (req, res) => {
  res.send(products);
});

router.post("/", (req, res) => {
  const { error } = validateProduct(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };

  products.push(product);
  res.send(product);
});

router.put("/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);

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

  res.send(product);
});

router.delete("/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);

  if (!product) {
    res.status(404).send("aradığınız ürün bulunamadı.");
    return;
  }

  const index = products.indexOf(product);
  products.splice(index, 1);

  res.send(product);
});

router.get("/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);

  if (!product) {
    res.status(404).send("aradığınız ürün bulunamadı");
  }
  res.send(product);
});

function validateProduct(product) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().required(),
  });

  return schema.validate(product);
}

module.exports = router;
