const app = require(__dirname + '/_server');
const config = require(__dirname + '/config');

function serverCb(port) {
  process.stdout.write('Server up on port ' + port + '!\n');
}

function mongoDbCb(mongoDbUri) {
  process.stdout.write('Database connected at ' + mongoDbUri + '!\n');
}

app(config.port, serverCb, config.mongoDbUri, mongoDbCb);
