const express = require("express");
const { validateRegister, User, validateLogin } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const { saltRounds } = require("../config");

router.get("/", async (req, res) => {
  res.send();
});

router.post("/register", async (req, res) => {
  const { error } = validateRegister(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res
      .status(400)
      .send("This email address does have a registered account.");
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    Number(saltRounds)
  );

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  await user.save();

  const token = user.createAuthToken();

  res.header("Authorization", token).send(user);
});

router.post("/auth", async (req, res) => {
  const { error } = validateLogin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).send("Incorrect email or incorrect password.");
  }

  const isSuccess = await bcrypt.compare(req.body.password, user.password);

  if (!isSuccess) {
    return res.status(400).send("Incorrect email or incorrect password.");
  }

  const token = user.createAuthToken();

  res.send(token);
});

module.exports = router;
