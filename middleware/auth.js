const jwt = require("jsonwebtoken");
const { secretKey } = require("../config");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("access denied");
  }

  try {
    const decodedToken = jwt.verify(token, secretKey);
    req.user = decodedToken;
    next();
  } catch (exception) {
    res.status(400).send("Faulty token");
  }
};
