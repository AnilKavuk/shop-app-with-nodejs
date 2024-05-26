const mongoose = require("mongoose");
const Joi = require("joi");

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
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
});

function validateProduct(product) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    imageUrl: Joi.string().required(),
    isActive: Joi.boolean().required(),
    category: Joi.string(),
  });

  return schema.validate(product);
}

const Product = mongoose.model("Product", productSchema);

module.exports = { Product, validateProduct };
