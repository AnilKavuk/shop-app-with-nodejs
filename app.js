const express = require("express");
const app = express();

//http methods: get, post, put, delete
app.get("/", (req, res) => {
  res.send("popüler ürünler");
});

app.listen(3000, () => {
  console.log("listening port 3000");
});
