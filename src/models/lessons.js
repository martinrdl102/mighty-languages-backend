const mongoose = require("mongoose");
const QuestionModel = require("./questions");
require("./comments")

const schema = new mongoose.Schema({
  title: String,
  videos: String,
  quiz: [QuestionModel.schema],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Lesson = mongoose.model("Lesson", schema);
module.exports = { Lesson, schema };
