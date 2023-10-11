const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  type: { type: String, enum: ["like", "dislike"] },
});

const Feedback = mongoose.model("Feedback", schema);

module.exports = { Feedback, schema };
