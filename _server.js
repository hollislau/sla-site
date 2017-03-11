const express = require('express');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();
const options = {
  key: fs.readFileSync(__dirname + '/ssl/private.key'),
  cert: fs.readFileSync(__dirname + '/ssl/certificate.pem')
};

app.use(morgan('dev'));
app.use(express.static(__dirname + '/build'));

module.exports = exports = function (port, mongoDbUri, cb) {
  if (mongoDbUri) mongoose.connect(mongoDbUri);

  return https.createServer(options, app).listen(port, cb);
};
