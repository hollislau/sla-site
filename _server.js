const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const mongoose = require('mongoose');
const morgan = require('morgan');
const authRouter = require(__dirname + '/routes/auth_router');
const config = require(__dirname + '/config');

var startServer;

const app = express();
const options = {
  key: fs.readFileSync(__dirname + config.sslPathMod + '/ssl/private.key'),
  passphrase: config.privateKeyPass,
  cert: fs.readFileSync(__dirname + config.sslPathMod + '/ssl/certificate.pem')
};

const connectDb = (mongoDbUri, cb, delay) => {
  var timeout;
  var tries = 0;

  const timeoutDelay = delay || 1000;

  const _mongoConnect = () => {
    mongoose.connect(mongoDbUri, (err) => {
      if (err) {
        if (tries > 9) return cb(err, mongoDbUri, tries);

        return timeout = setTimeout(() => {
          _mongoConnect();
          tries++;
        }, timeoutDelay);
      }

      if (timeout) clearTimeout(timeout);

      cb(null, mongoDbUri);
    });
  };

  _mongoConnect();
};

app.use(helmet());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/build'));
app.use('/api', authRouter);

startServer = (port, cb) => {
  return https.createServer(options, app).listen(port, () => cb(port));
};

module.exports = exports = {
  connectDb: connectDb,
  startServer: startServer
};
