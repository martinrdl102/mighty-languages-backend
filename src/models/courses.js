const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  description: String,
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  rating: Number,
  imageURL: String,
});

const Course = mongoose.model("Course", schema);
module.exports = { Course };
