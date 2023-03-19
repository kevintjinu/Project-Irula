const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  password: String,
  email: {type: String, unique: true},
  darkMode: Boolean,
  adminRole: Boolean,
});

module.exports = mongoose.model("User", userSchema);
