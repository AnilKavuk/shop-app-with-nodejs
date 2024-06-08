const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

function validateUser(user) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(50).required().email(),

    password: Joi.string().min(5).required(),
  });

  return schema.validate(user);
}

const User = mongoose.model("User", userSchema);

module.exports = { User, validateUser };
