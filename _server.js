const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.static(__dirname + '/build'));

module.exports = exports = function (port, mongoDbUri, cb) {
  if (mongoDbUri) {
    mongoose.connect(mongoDbUri);
  }

  return app.listen(port, cb);
};
