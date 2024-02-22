const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  finishedLessonsIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  currentLesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  numberOfLessons: Number,
  isActive: Boolean,
  isCompleted: Boolean,
  dateLastActivity: Date,
});

const CourseEnrollment = mongoose.model("CourseEnrollment", schema);
module.exports = { CourseEnrollment, schema };
