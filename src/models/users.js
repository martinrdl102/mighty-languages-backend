const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const schema = new mongoose.Schema({
  name: String,
  profilePic: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  type: String,
});

const User = mongoose.model("User", schema);

module.exports = { User, schema };
