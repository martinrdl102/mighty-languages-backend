const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const schema = new mongoose.Schema({
  name: String,
  profile_pic: String,
  courses_taken: [Number],
  email: { type: String, unique: true },
  password: String,
  token: String,
});

const User = mongoose.model("User", schema);

module.exports = { User, schema };
