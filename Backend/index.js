const mongoose = require('mongoose');

mongoose.set('debug', true);



mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/MDP-sample1')
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB', error));


const dictionarySchema = new mongoose.Schema({
  lexicalunit: String,
  pronunciation: String,
  grammaticalinfo: String,
  word: String,
  enlang: String,
  tamilword: String,
  tnlang: String,
  endefinition: String,
  endlang: String,
  tamildefinition: String,
  tndlang: String,
  picture: String,
  senseid: String,
});

const Dictionary = mongoose.model('Dictionary', dictionarySchema);
