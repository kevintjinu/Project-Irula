const mongoose = require("mongoose");

const wordSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  lexical_unit: String,
  audio_path: String,
  picture_path: String,
  grammatical_info: String,
  en_word: String,
  ta_word: String,
  en_meaning: String,
  ta_meaning: String
});

module.exports = mongoose.model("Word", wordSchema);
