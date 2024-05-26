const express = require("express");
const { Category, validateCategory } = require("../models/category");
const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404).send("aradığınız kategori yok");
  }

  res.send(category);
});

router.post("/", async (req, res) => {
  const { error } = validateCategory(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const category = new Category({
    name: req.body.name,
    isActive: req.body.isActive,
  });

  const newCategory = await category.save();
  res.send(newCategory);
});

router.put("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404).send("aradığınız kategori yok");
  }

  const { error } = validateCategory(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  category.name = req.body.name;
  category.isActive = req.body.name;

  const updatedCategory = await category.save();

  res.send(updatedCategory);
});

router.delete("/:id", async (req, res) => {
  let category = null;
  if (req.params.id.length === 24) {
    category = await Category.findByIdAndDelete(req.params.id);
  }

  if (!category) {
    res.status(404).send("aradığınız ürün bulunamadı.");
    return;
  }

  res.send(category);
});

module.exports = router;
