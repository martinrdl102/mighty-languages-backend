const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  description: String,
  imageURL: String,
});

const Course = mongoose.model("Course", schema);
module.exports = { Course };
