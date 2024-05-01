const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  videos: [String],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  index: Number,
  isQuizActive: Boolean,
});

const Lesson = mongoose.model("Lesson", schema);
module.exports = { Lesson, schema };
