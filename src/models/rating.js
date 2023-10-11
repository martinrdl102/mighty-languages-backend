const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  rating: Number,
});

const Rating = mongoose.model("Rating", schema);

module.exports = { Rating, schema };
