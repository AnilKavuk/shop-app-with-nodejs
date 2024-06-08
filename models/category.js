const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = mongoose.Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: Boolean,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

function validateCategory(category) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    isActive: Joi.boolean().required(),
    products: Joi.array(),
  });

  return schema.validate(category);
}

const Category = mongoose.model("Category", categorySchema);

module.exports = { Category, validateCategory };
