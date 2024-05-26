const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  text: String,
  username: String,
  date: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = { Comment, commentSchema };
