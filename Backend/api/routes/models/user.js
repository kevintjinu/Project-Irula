const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  name: String,
  password: String,
  email: String,
  darkMode: Boolean,
  adminRole: Boolean,
});

module.exports = mongoose.model("User", userSchema);
