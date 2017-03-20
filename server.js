const app = require(__dirname + '/_server');
const config = require(__dirname + '/config');

function serverCb(port) {
  process.stdout.write('Server up on port ' + port + '!\n');
}

function mongoDbCb(err, mongoDbUri) {
  if (err) return process.stderr.write('Database connection error: ' + err.message + '!\n');

  process.stdout.write('Database connected at ' + mongoDbUri + '!\n');
}

app.connectDb(config.mongoDbUri, mongoDbCb);
app.startServer(config.port, serverCb);
