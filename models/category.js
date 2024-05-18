const mongoose = require("mongoose");

const categorSchema = mongoose.Schema({
  name: String,
  date: {
    type: Date,
    default: Date.now,
  },
  isActive: Boolean,
});

Category = mongoose.model("Category", categorSchema);

module.exports = { Category };
