const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  description: String,
  imageURL: String,
  instructor: String,
});

const Course = mongoose.model("Course", schema);
module.exports = { Course };
