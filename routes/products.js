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
  // const products = await Product.find();
  // const products = await Product.find({ price: { $eq: 10000 } });
  // const products = await Product.find({ price: { $ne: 10000 } });
  // const products = await Product.find({ price: { $gt: 10000 } });
  // const products = await Product.find({ price: { $gte: 10000 } });
  // const products = await Product.find({ price: { $lt: 10000 } }); // price < 10000
  // const products = await Product.find({ price: { $lte: 10000 } }); // price <= 10000
  // const products = await Product.find({ price: { $in: [10000, 20000] } });
  // const products = await Product.find({ price: { $nin: [10000, 20000] } });
  // const products = await Product.find({ price: { $gte: 10000, $lte: 20000 } });
  // const products = await Product.find({ price: { $gte: 10000, $lte: 20000 }, name: "Samsung" }); // and
  // const products = await Product.find()
  //                             .or([
  //                                 { price: { $gte: 10000} },
  //                                 {isActive: true }
  //                             ]); // (price >= 10000 or isActive==true)

  // startwith
  // const products = await Product.find({ name: /^iphone/ });

  // endwith
  // const products = await Product.find({ name: /iphone$/ });

  // contains
  // const products = await Product.find({ name: /.*iphone.*/i });

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
