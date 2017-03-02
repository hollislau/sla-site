const express = require('express');
const app = express();

app.use(express.static(__dirname + '/build'));

module.exports = exports = function (port, cb) {
  return app.listen(port, cb);
};
