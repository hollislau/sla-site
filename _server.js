const express = require('express');
const helmet = require('helmet');
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

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/build'));

module.exports = exports = function (port, serverCb, mongoDbUri, mongoDbCb) {
  if (mongoDbUri) {
    mongoose.connect(mongoDbUri, () => {
      mongoDbCb(mongoDbUri);
    });
  }

  return https.createServer(options, app).listen(port, () => serverCb(port));
};
