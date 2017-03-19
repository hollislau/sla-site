const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require(__dirname + '/config');

const app = express();
const options = {
  key: fs.readFileSync(__dirname + config.sslPathMod + '/ssl/private.key'),
  passphrase: config.privateKeyPass,
  cert: fs.readFileSync(__dirname + config.sslPathMod + '/ssl/certificate.pem')
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
