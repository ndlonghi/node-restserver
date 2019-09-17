require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useCreateIndex: true}, (error, response) => {
  if (error) {
    throw error;
  } else {
    console.log('Database online');
  }
});

app.listen(process.env.PORT, () => {
  console.log('Listening on port: ', process.env.PORT);
});