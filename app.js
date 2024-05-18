const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");

const products = require("./routes/products");
const home = require("./routes/home");
const { db, port } = require("./config");

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET"],
  })
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET");
//   next();
// });

mongoose.set("strictQuery", false);

(async () => {
  try {
    await mongoose.connect(db);
    console.log("mongodb bağlantısı kuruldu.");
  } catch (err) {
    console.log(err);
  }
})();

app.use("/api/products", products);
app.use("/", home);

const productSchema = mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: Boolean,
});

const Product = mongoose.model("Product", productSchema);
const product = new Product({
  name: "Iphone 14",
  price: 30000,
  description: "Apple",
  imageUrl: "1.jpeg",
  isActive: true,
});

async function saveProduct() {
  try {
    const result = await product.save();
    console.log(result);
  } catch (err) {
    console.log("err: ", err);
  }
}

app.listen(port, () => {
  console.log("listening port " + port);
});
