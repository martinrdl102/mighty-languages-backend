const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  rating: Number,
});

const Rating = mongoose.model("Rating", schema);

module.exports = { Rating, schema };
