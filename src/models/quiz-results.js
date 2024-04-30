const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  userAnswers: [{
    questionIndex: Number,
    answers: [{ statementIndex: Number, value: String }],
  }]
});

const QuizResult = mongoose.model("QuizResult", schema);
module.exports = { QuizResult, schema };
