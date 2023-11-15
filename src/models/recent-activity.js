const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currentLessonIndex: Number,
  dateLastActivity: Date,
});

const RecentActivity = mongoose.model("RecentActivity", schema);
module.exports = { RecentActivity, schema };
