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

mongoose
  .connect(db)
  .then(() => {
    console.log("mongodb bağlantısı kuruldu.");
  })
  .catch((err) => console.log(err));

app.use("/api/products", products);
app.use("/", home);

app.listen(port, () => {
  console.log("listening port 3000");
});
