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

var connectDb;
var startServer;

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/build'));

connectDb = (mongoDbUri, mongoDbCb) => {
  mongoose.connect(mongoDbUri, (err) => {
    if (err) {
      return mongoDbCb(err, mongoDbUri);
    }

    mongoDbCb(null, mongoDbUri);
  });
};

startServer = (port, serverCb) => {
  return https.createServer(options, app).listen(port, () => serverCb(port));
};

module.exports = exports = {
  connectDb: connectDb,
  startServer: startServer
};
