const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  videos: [String],
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

const Lesson = mongoose.model("Lesson", schema);
module.exports = { Lesson, schema };
