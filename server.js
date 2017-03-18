const app = require(__dirname + '/_server');
const config = require(__dirname + '/config');

function serverCb() {
  process.stdout.write('Server up on port ' + config.port + '!\n');
}

function mongoDbCb(err) {
  if (err) {
    throw err;
  }

  process.stdout.write('Database connected at ' + config.mongoDbUri + '!\n');
}

app(config.port, serverCb, config.mongoDbUri, mongoDbCb);
