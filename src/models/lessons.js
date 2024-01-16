const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  videos: [String],
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  index: Number,
});

const Lesson = mongoose.model("Lesson", schema);
module.exports = { Lesson, schema };
