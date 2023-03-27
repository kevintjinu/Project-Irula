const mongoose = require("mongoose");

const wordSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  lexicalUnit: String,
  audioPath: String,
  picturePath: String,
  grammaticalInfo: String,
  enWord: {type: String, unique: true},
  irulaWord: String,
  taWord: String,
  enMeaning: String,
  taMeaning: String
});

module.exports = mongoose.model("Word", wordSchema);

