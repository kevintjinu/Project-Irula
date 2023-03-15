const express = require('express');
const fs = require('fs');
const app = express();

const jsonData = JSON.parse(fs.readFileSync('csvjson.json', 'utf-8'));

app.get('/data', (req, res) => {
  res.json(jsonData);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
 
         