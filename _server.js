const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const morgan = require('morgan');
const certConfig = require(__dirname + '/cert_config');
const privateKeyPass = require(__dirname + '/config').privateKeyPass;

const app = express();
const options = {
  key: certConfig.privateKey,
  passphrase: privateKeyPass,
  cert: certConfig.certificate
};

app.use(morgan('dev'));
app.use(express.static(__dirname + '/build'));

module.exports = exports = function (port, mongoDbUri, cb) {
  if (mongoDbUri) mongoose.connect(mongoDbUri);

  return https.createServer(options, app).listen(port, cb);
};
