const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
});

const QuizResult = mongoose.model("QuizResult", schema);
module.exports = { QuizResult, schema };
