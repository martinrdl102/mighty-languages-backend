const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  type: { type: String, enum: ["like", "dislike"] },
});

const Feedback = mongoose.model("Feedback", schema);

module.exports = { Feedback, schema };
