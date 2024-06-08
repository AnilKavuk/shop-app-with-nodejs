const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

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
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

function validateRegister(user) {
  const schema = new Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().min(3).max(50).required().email(),

    password: Joi.string().min(5).required(),
  });

  return schema.validate(user);
}

function validateLogin(user) {
  const schema = new Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return schema.validate(user);
}

userSchema.methods.createAuthToken = function () {
  return jwt.sign(
    { _id: this._id, name: this.name, isAdmin: this.isAdmin },
    secretKey
  );
};

const User = mongoose.model("User", userSchema);

module.exports = { User, validateRegister, validateLogin };
