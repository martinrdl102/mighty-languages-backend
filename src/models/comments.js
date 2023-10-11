const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
  lesson_id: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
});

const Comment = mongoose.model("Comment", schema);

module.exports = { Comment, schema };
