const express = require("express");
const app = express();

const Joi = require("joi");

app.use(express.json());

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

//http methods: get, post, put, delete
app.get("/", (req, res) => {
  res.send(products[0]);
});

app.get("/api/products", (req, res) => {
  res.send(products);
});

app.post("/api/products", (req, res) => {
  if (!req.body.name || req.body.name.length < 4) {
    res
      .status(400)
      .send("Ürün adı bilgisini en az 3 karakter olarak girmelisiniz.");
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

app.get("/api/products/:id", (req, res) => {
  const product = products.find((product) => product.id == req.params.id);

  if (!product) {
    res.status(404).send("aradığınız ürün bulunamadı");
  }
  res.send(product);
});

app.listen(3000, () => {
  console.log("listening port 3000");
});
