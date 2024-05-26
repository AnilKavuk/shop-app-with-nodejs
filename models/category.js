const mongoose = require("mongoose");
const Joi = require("joi");

const categorSchema = mongoose.Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: Boolean,
});

function validateCategory(category) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    isActive: Joi.boolean().required(),
  });

  return schema.validate(category);
}

const Category = mongoose.model("Category", categorSchema);

module.exports = { Category, validateCategory };
