const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: String,
  description: String,
  imageURL: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Course = mongoose.model("Course", schema);
module.exports = { Course };
