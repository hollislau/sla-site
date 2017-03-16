const fs = require('fs');
const config = require(__dirname + '/config');

const privateKey = fs.readFileSync(__dirname + config.sslPathMod + '/ssl/private.key');
const certificate = fs.readFileSync(__dirname + config.sslPathMod + '/ssl/certificate.pem');
const customCa = config.domain === 'localhost' ? certificate : null;

module.exports = exports = {
  privateKey: privateKey,
  certificate: certificate,
  customCa: customCa
};
